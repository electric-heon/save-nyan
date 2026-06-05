class Poptart extends GameComponent{
    static images = {}
    static flavorImageMap = {
        cherry: "images/poptart-1.png",
        blueberry: "images/poptart-3.png",
        fudge: "images/poptart-6.png",
        oreo: "images/poptart-2.png",
        sprinkle: "images/poptart-5.png",
        choco: "images/poptart-4.png"
    }

    constructor(x, y, width, height, flavor, durability) {
        super()
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.flavor = flavor
        this.transparency = 0
        this._durability = durability
        this._hitCount = 0

        Poptart.loadImage(flavor)
    }

    static loadImage(flavor) {
        if (!Poptart.images[flavor]) {
            const src = Poptart.flavorImageMap[flavor] || Poptart.flavorImageMap.cherry
            const img = new Image()
            Poptart.images[flavor] = img
            img.src = src
        }
    }

    static preload() {
        Object.keys(Poptart.flavorImageMap).forEach(flavor => Poptart.loadImage(flavor))
        return Promise.all(
            Object.values(Poptart.images).map(img =>
                img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r })
            )
        )
    }

    get hitCount() {
        return this._hitCount
    }

    set hitCount(hitCount) {
        this._hitCount = hitCount
    }

    get durability() {
        return this._durability
    }

    set durability(durability) {
        this._durability = this.durability
    }

    draw() {
        const src = Poptart.images[this.flavor]
        GameComponent.context.globalAlpha = 1 - this.transparency
        GameComponent.context.drawImage(src, this.x, this.y, this.width, this.height)
        GameComponent.context.globalAlpha = 1
    }

    erase() {
        GameComponent.context.clearRect(this.x, this.y, this.width, this.height)
    }

    collidesWith(cat) {
        return  cat.x < this.x + this.width &&
                cat.x + cat.width > this.x &&
                cat.y < this.y + this.height &&
                cat.y + cat.height > this.y
    }

    collisionAxis(cat) {
        const catLeft   = cat.x;
        const catRight  = cat.x + cat.width ;
        const catTop    = cat.y;
        const catBottom = cat.y + cat.height;

        const popLeft   = this.x;
        const popRight  = this.x + this.width;
        const popTop    = this.y;
        const popBottom = this.y + this.height;

        const overlapX = Math.min(catRight, popRight) - Math.max(catLeft, popLeft);
        const overlapY = Math.min(catBottom, popBottom) - Math.max(catTop, popTop);

        // 한 축이라도 안 겹치면 충돌 아님
        if (overlapX <= 0 || overlapY <= 0) return null;

        return overlapX < overlapY ? "x" : "y";
    }
}

class PoptartManager extends GameComponent {
    static durablePoptartNumber = [[2,0], [4,1], [8,3], [12, 5], [16, 10]]

    constructor(row, col, gap, level, poptartSkin) {
        super()
        this.row = row;
        this.col = col;
        this.gap = gap;
        this.level = level;
        this.startX = GameComponent.canvasWidth/2 + 40
        this.startY = 57.5
        this.map = [];
        
        this.poptartSkin = []

        if (poptartSkin == "cherry") {
            this.poptartSkin = ["cherry", "blueberry", "fudge"]
        } else {
            this.poptartSkin = ["oreo", "sprinkle", "choco"]
        }

        this.durablePoptart = this.pickDurablePoptart(PoptartManager.durablePoptartNumber[this.level-1][0], PoptartManager.durablePoptartNumber[this.level-1][1])

        console.log(this.durablePoptart)
        
        const TART_WIDTH = 70
        const TART_HEIGHT = 90

        const STEP_X =  TART_WIDTH + this.gap
        const STEP_Y = TART_HEIGHT + this.gap


        // 팝타르트 객체 배열 초기화
        for (let i = 0; i < this.row; i++) {
            const TART_Y = i * STEP_Y + this.startY
            const rowArr = []

            for (let j = 0; j < this.col; j++) {
                const TART_X = j * STEP_X + this.startX
                const idx = i * this.col + j

                if (this.durablePoptart[0].indexOf(idx) != -1) {
                    rowArr.push(new Poptart(TART_X, TART_Y, TART_WIDTH, TART_HEIGHT, this.poptartSkin[1], 2))

                } else if (this.durablePoptart[1].indexOf(idx) != -1) {
                    rowArr.push(new Poptart(TART_X, TART_Y, TART_WIDTH, TART_HEIGHT, this.poptartSkin[2], 3))
                } else {
                   rowArr.push(new Poptart(TART_X, TART_Y, TART_WIDTH, TART_HEIGHT, this.poptartSkin[0], 1))
                }
            }

            this.map.push(rowArr)
        }
    }

    setSkin(poptartSkin) {
        if (poptartSkin == "cherry") {
            this.poptartSkin = ["cherry", "blueberry", "fudge"]
        } else {
            this.poptartSkin = ["oreo", "sprinkle", "choco"]
        }

        this.poptartSkin.forEach(flavor => Poptart.loadImage(flavor))

        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.map[i][j] != null) {
                    const durability = this.map[i][j].durability
                    if (durability == 2) {
                        this.map[i][j].flavor = this.poptartSkin[1]
                    } else if (durability == 3) {
                        this.map[i][j].flavor = this.poptartSkin[2]
                    } else {
                        this.map[i][j].flavor = this.poptartSkin[0]
                    }
                }
            }
        }
    }

    // 내구도가 높은 팝타르트를 넣을 위치 랜덤으로 선정
    pickDurablePoptart(num1, num2) {
        const total = this.row * this.col
        let location2 = []      // 내구도 2인 팝타르트 위치
        let location3 = []      // 내구도 3인 팝타르트 위치

        while (location2.length < num1) {
            let randNum = Math.floor(Math.random() * total)

            if (location2.indexOf(randNum) == -1) {
                location2.push(randNum)
            }
        }

        while (location3.length < num2) {
            let randNum = Math.floor(Math.random() * total)

            if (location2.indexOf(randNum) == -1 && location3.indexOf(randNum) == -1) {     // 내구도 2 팝타르트와 내구도 3 팝타르트 위치 중복 방지
                location3.push(randNum)
            }
        }

        return [location2, location3]
    }

    draw() {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.map[i][j] == null) {
                    continue
                }
                this.map[i][j].draw()
            }
        }
    }


    // cat과 충돌 처리
    handleCollision(cat) {

        outer: for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.map[i][j] == null) {
                    continue
                }
                if (this.map[i][j].collidesWith(cat)) {         // 충돌 후 방향 전환
                    if (Math.abs(cat.dx) <= cat.speed || Math.abs(cat.dy) <= cat.speed) {
                        cat.isWormhole = false
                    }
                    const axis = this.map[i][j].collisionAxis(cat)
                    if (axis == 'x') {
                        if (!cat.isWormhole) {
                            if (cat.dx > 0) {
                                cat.x = this.map[i][j].x - cat.width
                            } else {
                                cat.x = this.map[i][j].x + this.map[i][j].width
                            }
                            cat.dx = -(Math.sign(cat.dx) || 1) * cat.speed
                        } else {
                            cat.dx *= 0.5
                        }
                    } else if (axis == 'y') {
                        if (!cat.isWormhole) {
                            if (cat.dy > 0) {
                                cat.y = this.map[i][j].y - cat.height
                            } else {
                                cat.y = this.map[i][j].y + this.map[i][j].height
                            }
                            cat.dy = -(Math.sign(cat.dy) || 1) * cat.speed
                        } else {
                            cat.dy *= 0.5
                        }
                    }
                    this.map[i][j].hitCount++                                       // 충돌 횟수 증가
                    if (this.map[i][j].durability == this.map[i][j].hitCount) {     // 내구도 0 도달 시 팝 타르트 삭제
                        this.map[i][j].erase()
                        this.map[i][j] = null

                        return true;
                    } else {
                        this.map[i][j].transparency += 0.4
                        break outer
                    }
                }
            }
        }

        return false
    }

    isCleared() {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.map[i][j] != null) {
                    return false
                }
            }
        }

        return true
    }
}
