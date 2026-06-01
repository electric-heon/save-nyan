class Poptart extends GameComponent{
    constructor(x, y, width, height, flavor, durability) {
        super()
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this._durability = durability
        this._hitCount = 0

        if (flavor == "cherry") {
            this.image = new Image()
            this.image.onload = () => this.draw()
            this.image.src = "images/poptart-1.svg"
        } else if (flavor == "oreo") {
            this.image = new Image()
            this.image.onload = () => this.draw()
            this.image.src = "images/poptart-2.svg"
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
        if (this.image && this.image.complete) {
            GameComponent.context.drawImage(this.image, this.x, this.y, this.width, this.height)
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
        this.startX = GameComponent.canvasWidth/2 + 90
        this.startY = 35
        this.map = [];
        this.poptartSkin = poptartSkin;

        const TART_WIDTH = 90
        const TART_HEIGHT = 80

        const STEP_X =  TART_WIDTH + this.gap
        const STEP_Y = TART_HEIGHT + this.gap

        for (let i = 0; i < row; i++) {
            const TART_Y = i * STEP_Y + this.startY
            const row = []
            for (let j = 0; j < col; j++) {
                const TART_X = j * STEP_X + this.startX
                row.push(new Poptart(TART_X, TART_Y, TART_WIDTH, TART_HEIGHT, this.poptartSkin, 1))
            }

            this.map.push(row)
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

    handleCollision(cat) {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.map[i][j] == null) {
                    continue
                }
                if (this.map[i][j].collidesWith(cat)) {
                    if (this.map[i][j].collisionAxis(cat) == 'x') {
                        cat.dx *= -1
                    } else if (this.map[i][j].collisionAxis(cat) == 'y') {
                        cat.dy *= -1
                    }
                    this.map[i][j].hitCount++
                    if (this.map[i][j].durability == this.map[i][j].hitCount) {
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
