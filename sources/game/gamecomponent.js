class GameComponent {
    static canvas;
    static canvasWidth;
    static canvasHeight;
    static context;

    static init() {
        this.canvas = document.querySelector('#game'); 
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.context = this.canvas.getContext('2d');
    }
}