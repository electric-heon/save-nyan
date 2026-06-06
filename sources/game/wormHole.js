class Wormhole extends GameComponent {
    static imagePaths = {
        entrance: "images/wormhole_entrance.png",
        exit: "images/wormhole_exit.png"
    }

    static images = {}

    static preload() {
        return Promise.all(Object.entries(Wormhole.imagePaths).map(([id, path]) => {
            if (Wormhole.images[id]) return Promise.resolve()
            const img = new Image()
            img.src = path
            Wormhole.images[id] = img
            return img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r })
        }))
    }

    static cordX = {
        entrance: 150,
        exit: 400
    }

    constructor(width, height, id){
        super();

        
        this.width = width;
        this.height = height;
        this.id = id;
        
        this.x = Wormhole.cordX[id];
        this.y = Math.random() * (GameComponent.canvasHeight - 100);
        
        this.isActive = true; // 스테이지 시작 시 활성화
        this.image = Wormhole.images[id];

    }

    reset() {
        this.y = Math.random() * (GameComponent.canvasHeight - 100);
        this.isActive = true; // 게임오버 시 활성화
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