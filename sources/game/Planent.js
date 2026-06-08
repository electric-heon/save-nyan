class Planet extends GameComponent {
    // 사용할 행성 이미지 경로 배열
    static imagePath = [
        "assets/images/planet-1.png",
        "assets/images/planet-2.png",
        "assets/images/planet-3.png",
    ]

    // 이미지 객체들을 저장해두는 배열
    // static이므로 모든 Planet 객체가 공유함
    static images = []

    constructor(x, y, size, gravityRadius, turnStrength) {
        super()

        // 행성의 위치와 크기
        this.x = x
        this.y = y
        this.size = size

        // 중력 범위와 중력에 의한 방향 전환 강도
        this.gravityRadius = gravityRadius
        this.turnStrength = turnStrength

        // 실제 충돌 판정에 사용할 반지름
        // 이미지 전체 크기보다 조금 작게 잡음
        this.collisionRadius = size * 0.42

            // 이미지가 아직 로딩되지 않았다면 한 번만 로딩
        if (Planet.images.length === 0) {
            Planet.preload()
        }

        // 행성 생성 시 이미지 3개 중 하나를 랜덤으로 선택
        // draw()에서 랜덤으로 고르면 계속 바뀌므로 constructor에서 고정함
        const randomIndex = Math.floor(Math.random() * Planet.images.length)
        this.image = Planet.images[randomIndex]

        // this.image.onload = () => {
        //     this.draw()
        // }

    }

    static preload() {
        if (Planet.images.length === 0) {
            Planet.images = Planet.imagePath.map(path => {
                const img = new Image()
                img.src = path
                return img
            })
        }
        
        return Promise.all(Planet.images.map(img =>
            img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r })
        ))
    }

    // 행성 중심의 x좌표
    get centerX() {
        return this.x + this.size / 2
    }

    // 행성 중심의 y좌표
    get centerY() {
        return this.y + this.size / 2
    }

    draw() {
        const context = GameComponent.context

        // 이미지가 정상적으로 로딩되었을 때만 행성을 그림
        if (this.image.complete && this.image.naturalWidth > 0) {
            context.drawImage(this.image, this.x, this.y, this.size, this.size)
        }
    }

    collidesWith(cat) {
        // 고양이의 중심 좌표 계산
        const catCenterX = cat.x + cat.width / 2
        const catCenterY = cat.y + cat.height / 2

        // 행성과 고양이 중심 사이의 x, y 거리 차이
        const dx = this.centerX - catCenterX
        const dy = this.centerY - catCenterY

        // 고양이를 원으로 보았을 때의 반지름
        const catRadius = Math.min(cat.width, cat.height) / 2

        // 두 원의 중심 거리 <= 두 반지름의 합이면 충돌
        return Math.hypot(dx, dy) <= this.collisionRadius + catRadius
    }

    bounce(cat) {
        // 고양이의 중심 좌표 계산
        const catCenterX = cat.x + cat.width / 2
        const catCenterY = cat.y + cat.height / 2

        // 행성 중심에서 고양이 중심으로 향하는 방향 벡터
        let normalX = catCenterX - this.centerX
        let normalY = catCenterY - this.centerY
        let distance = Math.hypot(normalX, normalY)

        // 고양이와 행성이 겹치지 않기 위해 필요한 최소 거리
        const catRadius = Math.min(cat.width, cat.height) / 2
        const minDistance = this.collisionRadius + catRadius

        // 두 중심이 완전히 겹쳤을 때 0으로 나누는 오류 방지
        if (distance <= 0) {
            normalX = -cat.dx
            normalY = -cat.dy
            distance = Math.hypot(normalX, normalY) || 1
        }

        // 방향 벡터를 길이 1로 정규화
        normalX /= distance
        normalY /= distance

        // 고양이의 이동 방향과 충돌 방향의 내적 계산
        const dot = cat.dx * normalX + cat.dy * normalY

        // 고양이가 행성 쪽으로 이동 중일 때만 반사 처리
        if (dot < 0) {
            cat.dx -= 2 * dot * normalX
            cat.dy -= 2 * dot * normalY
        }

        // 충돌 후 겹친 만큼 고양이를 바깥쪽으로 밀어냄
        const pushOut = minDistance - distance + 1
        if (pushOut > 0) {
            cat.x += normalX * pushOut
            cat.y += normalY * pushOut
        }
    }

    distanceTo(cat) {
        // 고양이 중심 좌표 계산
        const catCenterX = cat.x + cat.width / 2
        const catCenterY = cat.y + cat.height / 2

        // 행성 중심과 고양이 중심 사이의 거리 반환
        return Math.hypot(this.centerX - catCenterX, this.centerY - catCenterY)
    }

    applyGravity(cat, factor = 1) {
        // 고양이 중심 좌표 계산
        const catCenterX = cat.x + cat.width / 2
        const catCenterY = cat.y + cat.height / 2

        // 고양이에서 행성으로 향하는 벡터
        const toPlanetX = this.centerX - catCenterX
        const toPlanetY = this.centerY - catCenterY
        const distance = Math.hypot(toPlanetX, toPlanetY)

        // 중력 범위 밖이거나 거리가 0이면 중력 적용 안 함
        if (distance <= 0 || distance > this.gravityRadius) {
            return
        }

        // 현재 고양이의 속력 계산
        const speed = Math.hypot(cat.dx, cat.dy)

        // 속력이 0이면 방향을 바꿀 수 없으므로 종료
        if (speed <= 0) {
            return
        }

        // 현재 이동 방향 각도
        const currentAngle = Math.atan2(cat.dy, cat.dx)

        // 고양이에서 행성 쪽으로 향하는 목표 각도
        const targetAngle = Math.atan2(toPlanetY, toPlanetX)

        // 현재 각도와 목표 각도의 차이 계산
        // -PI ~ PI 범위로 안정적으로 정리함
        const angleDiff = Math.atan2(
            Math.sin(targetAngle - currentAngle),
            Math.cos(targetAngle - currentAngle)
        )

        // 행성에 가까울수록 중력 영향이 커지도록 계산
        const influence = Math.pow(1 - distance / this.gravityRadius, 2)

        // 한 프레임에서 방향을 바꿀 수 있는 최대 각도
        const maxTurn = this.turnStrength * influence * factor

        // 실제 회전량을 maxTurn 범위 안으로 제한
        const turn = Math.max(-maxTurn, Math.min(maxTurn, angleDiff))

        // 새로운 이동 각도
        const nextAngle = currentAngle + turn

        // 속력은 유지하고 방향만 바꿈
        cat.dx = Math.cos(nextAngle) * speed
        cat.dy = Math.sin(nextAngle) * speed
    }
}



class PlanetManager extends GameComponent {
    
    constructor(level, forbiddenAreas = []) {
        super()
        this.planets = []
        this.forbiddenAreas = forbiddenAreas

        //레벨만큼 행성 생성(최대개수 3개) 
        const planetCounts = Math.min(3, level)

        this.createPlanets(planetCounts)
    }

    // 행성이 놓일 수 있는 합법 영역(좌우 벽/금지구역을 피한 중앙 띠)
    // x: 300 ~ 520, y: 40 ~ 560 범위는 모든 금지구역 밖이라 행성 간 거리만 확인하면 됨
    static bounds = { minX: 300, maxX: 520, minY: 40, maxY: 560 }

    createPlanets(count) {
        // 행성 기본 설정값
        const sizeArr = [36, 41, 46]
        const gravityRadius = 210
        const turnStrength = 0.05

        // 필요한 개수만큼 행성 생성
        for (let i = 0; i < count; i++) {
            // size 값 3개 중 랜덤으로 사용
            const size = sizeArr[Math.floor(Math.random() * sizeArr.length)]

            // 합법 영역 안에서 행성 하나 생성 시도
            const planet = this.createPlanet(size, gravityRadius, turnStrength)

            // 유효한 위치에 생성되었을 때만 배열에 추가
            if (planet) {
                this.planets.push(planet)
            }
        }
    }

    createPlanet(size, gravityRadius, turnStrength) {
        const { minX, maxX, minY, maxY } = PlanetManager.bounds

        // 행성 스프라이트 전체가 영역 안에 들어오도록 우/하단은 size만큼 당김
        const spanX = Math.max(1, maxX - size - minX)
        const spanY = Math.max(1, maxY - size - minY)

        // 위치를 찾기 위한 최대 시도 횟수
        const maxAttempts = 120

        for (let i = 0; i < maxAttempts; i++) {
            const x = minX + Math.random() * spanX
            const y = minY + Math.random() * spanY

            // 다른 행성/금지구역과 겹치지 않을 때만 실제 객체를 만들어 반환
            // (객체 생성을 검증 통과 후로 미뤄 불필요한 Planet 생성을 피함)
            if (this.isValidPosition(x, y, size)) {
                return new Planet(x, y, size, gravityRadius, turnStrength)
            }
        }

        // 끝까지 적절한 위치를 못 찾으면 null 반환
        return null
    }

    isValidPosition(x, y, size) {
        // 행성 중심 좌표
        const centerX = x + size / 2
        const centerY = y + size / 2

        // 이미 생성된 다른 행성과 너무 가까운지 검사
        // 합법 띠가 좁아 3개를 모두 배치하려면 간격을 너무 크게 잡으면 안 됨
        const minPlanetGap = 100
        for (const other of this.planets) {
            const distance = Math.hypot(centerX - other.centerX, centerY - other.centerY)

            // 행성끼리 너무 가까우면 배치 불가
            if (distance < size / 2 + other.size / 2 + minPlanetGap) {
                return false
            }
        }

        // 금지 구역과 겹치는지 검사
        for (const area of this.forbiddenAreas) {
            // 사각형 영역 안에서 행성 중심과 가장 가까운 점 계산
            const nearestX = Math.max(area.x, Math.min(centerX, area.x + area.width))
            const nearestY = Math.max(area.y, Math.min(centerY, area.y + area.height))

            // 행성 중심과 금지 구역의 가장 가까운 점 사이 거리
            const distance = Math.hypot(centerX - nearestX, centerY - nearestY)

            // 행성과 금지 구역이 너무 가까우면 배치 불가
            if (distance < size / 2 + area.padding) {
                return false
            }
        }

        // 모든 검사를 통과하면 배치 가능
        return true
    }

    draw() {
        // 생성된 모든 행성 그리기
        for (const planet of this.planets) {
            planet.draw()
        }
    }

    handleCollision(cat) {
        // 웜홀 상태에서는 행성과 충돌하지 않음
        if (cat.isWormhole) {
            return false
        }

        // 모든 행성과 충돌 검사
        for (const planet of this.planets) {
            if (planet.collidesWith(cat)) {
                // 충돌한 경우 고양이를 튕겨냄
                planet.bounce(cat)
                return true
            }
        }

        // 충돌한 행성이 없으면 false 반환
        return false
    }

    applyGravity(cat, factor = 1) {
        // 웜홀 상태에서는 중력을 받지 않음
        if (cat.isWormhole) {
            return
        }

        // 가장 가까운 행성을 찾기 위한 변수
        let nearest = null
        let nearestDistance = Infinity

        // 중력 범위 안에 있는 행성 중 가장 가까운 행성 찾기
        for (const planet of this.planets) {
            const distance = planet.distanceTo(cat)

            if (distance < planet.gravityRadius && distance < nearestDistance) {
                nearest = planet
                nearestDistance = distance
            }
        }

        // 가장 가까운 행성이 있으면 그 행성의 중력만 적용
        if (nearest) {
            nearest.applyGravity(cat, factor)
        }
    }
}
