const key = {
	up : false,
	down : false
}

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") key.up = true;
    if (e.key === "ArrowDown") key.down = true;
});

window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp") key.up = false;
    if (e.key === "ArrowDown") key.down = false;
});

window.addEventListener("load", () => {
	const canvas = document.querySelector("#game");
	const context = canvas.getContext("2d");
	const bar = new Bar(30, 300, 15, 60, 5, context, canvas.height)
    const poptartImage = new Image();
    poptartImage.src = "poptart-1-trimmed.svg";
    const poptartManager = new PoptartManager(6, 4, canvas.width, canvas.height, 85, 10, poptartImage, context)
	const play = () => {
    	context.clearRect(0, 0, canvas.width, canvas.height);
        poptartManager.draw();
	    bar.update(key);
    	requestAnimationFrame(play);
	};
	play();
});

class Bar {
    constructor(x, y, width, height, speed, context, canvasHeight) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.context = context;
        this.canvasHeight = canvasHeight;
    }

    move(key) {
        if (key.up) {
            this.y -= this.speed;
        }

        if (key.down) {
            this.y += this.speed;
        }

        if (this.y < 0) {
            this.y = 0;
        }

        if (this.y + this.height > this.canvasHeight) {
            this.y = this.canvasHeight - this.height;
        }
    }

    draw() {
        this.context.fillStyle = "white";
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }

    isHitBall(ball) {
        if ((ball.x - ball.radius) <= (this.x + this.width) && (ball.x + ball.radius) >= this.x) {
            if ((ball.y + ball.radius) >= this.y && (ball.y - ball.radius) <= (this.y + this.height)) {
                return true;
            }
        }
        return false;
    }

    update(key) {
    	this.move(key)
    	this.draw()
    }
}

class PoptartManager {
    constructor(row, col, canvasWidth, canvasHeight, width, gap, image, context) {
        this.row = row;
        this.col = col;
        this.width = width;
        this.gap = gap;
        this.image = image;
        this.context = context;

        // 원본 이미지 비율
        this.imageRatio = 1166.94 / 1117.84;
        this.height = this.width / this.imageRatio;

        this.drawWidth = this.height;
        this.drawHeight = this.width;

        this.totalWidth = this.col * this.drawWidth + (this.col - 1) * this.gap;
        this.totalHeight = this.row * this.drawHeight + (this.row - 1) * this.gap;

        const rightStartX = canvasWidth / 2;
        const rightWidth = canvasWidth / 2;

        this.x = rightStartX + (rightWidth - this.totalWidth) / 2;
        this.y = (canvasHeight - this.totalHeight) / 2;
        this.poptarts = Array.from({ length: row }, () => Array(col).fill(1));
        console.table(this.poptarts);
    }

    draw() {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.poptarts[i][j] === 1) {
                    const poptartX = this.x + j * (this.drawWidth + this.gap);
                    const poptartY = this.y + i * (this.drawHeight + this.gap);

                    this.context.save();

                    this.context.translate(
                        poptartX + this.drawWidth / 2,
                        poptartY + this.drawHeight / 2
                    );

                    this.context.rotate(-Math.PI / 2);

                    this.context.drawImage(
                        this.image,
                        -this.drawHeight / 2,
                        -this.drawWidth / 2,
                        this.drawHeight,
                        this.drawWidth
                    );

                    this.context.restore();
                }
            }
        }
        // console.log(this.poptarts)
    }
}