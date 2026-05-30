class NyanCat extends GameComponent {
    constructor(x, y, speed, skin) {
        super()
        this._x = x
        this._y = y
        this.speed = speed
        this._dx = speed
        this._dy = speed        
        this.size = 1
        this._height = 80 
        this._width =  80 
        this.catImage = new Image()
        this.catImage.onload = () => this.draw()
        this.catImage.src = (skin == "cherry") ? "images/nyancat-1.svg" : "images/nyancat-3.svg"
    }

    draw() {
        if (this.catImage.complete) {
            GameComponent.context.drawImage(this.catImage, this._x, this._y, this._width, this._height);
        }
    }

    erase() {
        GameComponent.context.clearRect(this.catImage, this._x, this._y, this._width, this._height);        
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }

    get dx() {
        return this._dx
    }

    get dy() {
        return this._dy
    }

    get height() {
        return this._height
    }

    get width() {
        return this._width
    }

    set x(x) {
        this._x = x
    }

    set y(y) {
        this._y = y
    }

    set dx(dx) {
        this._dx = dx
    }

    set dy(dy) {
        this._dy = dy
    }

    set width(width) {
        this._width = width
    }

    set height(height) {
        this._height = height
    }

    reset() {
        this.x = 80
        this.y = 300 - this.width/2 + 10
        this._dx = this.speed
    }
}
