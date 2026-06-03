class Poptart extends GameComponent{
    static images = {}

    constructor(x, y, width, height, flavor, durability) {
        super()
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.flavor = flavor
        this._durability = durability
        this._hitCount = 0

        if (!Poptart.images[flavor]) {
            const src =  "images/poptart-1.png"
            const img = new Image()
            Poptart.images[flavor] = img
            img.src = src
        }
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
        if (src instanceof ImageBitmap) {
            GameComponent.context.drawImage(src, this.x, this.y, this.width, this.height)
        } else if (src instanceof HTMLImageElement && src.complete) {
            GameComponent.context.drawImage(src, this.x, this.y, this.width, this.height)
        }
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
    constructor(row, col, gap, level, poptartSkin) {
        super()
        this.row = row;
        this.col = col;
        this.gap = gap;
        this.level = level;
        this.startX = GameComponent.canvasWidth/2 + 40
        this.startY = 57.5
        this.map = [];
        this.poptartSkin = poptartSkin;

        const TART_WIDTH = 70
        const TART_HEIGHT = 90

        const STEP_X =  TART_WIDTH + this.gap
        const STEP_Y = TART_HEIGHT + this.gap


        // 팝타르트 객체 배열 초기화
        for (let i = 0; i < row; i++) {
            const TART_Y = i * STEP_Y + this.startY
            const row = []

            for (let j = 0; j < col; j++) {
                const TART_X = j * STEP_X + this.startX
                row.push(new Poptart(TART_X, TART_Y, TART_WIDTH, TART_HEIGHT, this.poptartSkin, 1))
            }

            this.map.push(row)
        }

        const img = Poptart.images[this.poptartSkin]
        if (img instanceof HTMLImageElement && !img.complete) {
            img.onload = () => this.draw()
        }
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
        
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.map[i][j] == null) {
                    continue
                }
                if (this.map[i][j].collidesWith(cat)) {         // 충돌 후 방향 전환
                    if (Math.abs(cat.dx) <= cat.speed || Math.abs(cat.dy) <= cat.speed) {
                        cat.isWormhole = false
                    }
                    if (this.map[i][j].collisionAxis(cat) == 'x') {
                        if (!cat.isWormhole) {
                            cat.dx *= -(cat.speed) / Math.abs(cat.dx)
                        } else {
                            cat.dx *= 0.5
                        }
                    } else if (this.map[i][j].collisionAxis(cat) == 'y') {
                        if (!cat.isWormhole) {
                            cat.dy *= -(cat.speed) / Math.abs(cat.dy)
                        } else {
                            cat.dy *= 0.5                                                        
                        }
                    }
                    this.map[i][j].hitCount++                   // 충돌 횟수 증가
                    if (this.map[i][j].durability == this.map[i][j].hitCount) {   // 내구도 0 도달 시 팝 타르트 삭제
                        this.map[i][j].erase()
                        this.map[i][j] = null

                        return true;
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
