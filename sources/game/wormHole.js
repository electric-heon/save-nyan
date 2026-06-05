class Wormhole extends GameComponent {
    static images = {
        entrance: "images/wormhole_entrance.png",
        exit: "images/wormhole_exit.png"
    }

    constructor(x, y, width, height, id){
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = id;
        
        this.isActive = true; // 스테이지 시작 시 활성화
        this.image = new Image();
        this.image.src = Wormhole.images[id]; // 웜홀 이미지 경로

        this.image.onload = () => {
            this.draw()
        }

    }

    draw() {
        if(this.isActive && this.image.complete){
            GameComponent.context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    collidesWith(cat) {
        if (!this.isActive) return false;
        return cat.x < this.x + this.width &&
               cat.x + cat.width > this.x &&
               cat.y < this.y + this.height &&
               cat.y + cat.height > this.y;
    }
}