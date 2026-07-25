const key = {
	up : false,
	down : false,
}

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") key.up = true;
    if (e.key === "ArrowDown") key.down = true;
});

window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp") key.up = false;
    if (e.key === "ArrowDown") key.down = false;
});

class Bar extends GameComponent {
    constructor(x, y, width, height, speed) {
        super()
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    move(key, factor = 1) {
        if (key.up) {
            this.y -= this.speed * factor;
        }

        if (key.down) {
            this.y += this.speed * factor;
        }

        if (this.y < 0) {
            this.y = 0;
        }

        if (this.y + this.height > GameComponent.canvasHeight) {
            this.y = GameComponent.canvasHeight - this.height;
        }
    }

    draw() {
        GameComponent.context.fillStyle = "grey";
        GameComponent.context.fillRect(this.x, this.y, this.width, this.height);
    }

    erase() {
        GameComponent.context.clearRect(this.x, this.y, this.width, this.height);
    }

    reset() {
        this.x = 30
        this.y = 250
    }

    update(key, factor = 1) {
    	this.move(key, factor)
    	this.draw()
    }
}

