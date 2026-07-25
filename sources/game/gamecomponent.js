
// Canvas 정보, context 저장
class GameComponent {
    static canvas;
    static canvasWidth;
    static canvasHeight;
    static context;

    width = 0;
    height = 0;

    static init() {
        this.canvas = document.querySelector('#game');
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.context = this.canvas.getContext('2d');
    }

    collidesWith(cat) {
        return  cat.x < this.x + this.width &&
                cat.x + cat.width > this.x &&
                cat.y < this.y + this.height &&
                cat.y + cat.height > this.y;
    }

    collisionAxis(cat) {
        const catLeft   = cat.x;
        const catRight  = cat.x + cat.width;
        const catTop    = cat.y;
        const catBottom = cat.y + cat.height;

        const overlapX = Math.min(catRight, this.x + this.width) - Math.max(catLeft, this.x);
        const overlapY = Math.min(catBottom, this.y + this.height) - Math.max(catTop, this.y);

        if (overlapX <= 0 || overlapY <= 0) return null;

        return overlapX < overlapY ? "x" : "y";
    }
}