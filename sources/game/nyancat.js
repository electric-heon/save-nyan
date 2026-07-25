class NyanCat extends GameComponent {
    static skinImageMap = {
        cherry: "assets/images/nyancat-1.png",
        oreo: "assets/images/nyancat-3.png",
    }

    constructor(x, y, speed, skin) {
        super()
        this.x = x
        this.y = y
        this.speed = speed
        this.dx = speed
        this.dy = Math.random() < 0.5 ? speed : -speed
        this.prevX = x
        this.prevY = y
        this.minimumComponentSpeed = speed * 0.35
        this.height = 40
        this.width = 55
        this.size = 1
        this.poptartHitCooldown = 0

        this.catImage = new Image()
        this.setSkin(skin)
    }

    setSkin(skin) {
        this.skin = skin
        this.catImage.onload = () => {
            this.draw()
        }
        this.catImage.src = NyanCat.skinImageMap[skin] || NyanCat.skinImageMap.cherry
    }

    reset() {
        this.x = 80
        this.y = 300 - this.width/2 + 10
        this.prevX = this.x
        this.prevY = this.y
        this.dx = this.speed
        this.dy = Math.random() < 0.5 ? this.speed : -this.speed
        this.poptartHitCooldown = 0
    }

    rememberPosition() {
        this.prevX = this.x
        this.prevY = this.y
    }

    draw() {
        const ctx = GameComponent.context;
        if (this.dx < 0) {
            ctx.save();
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.catImage, 0, 0, this.width, this.height);
            ctx.restore();
        } else {
            ctx.drawImage(this.catImage, this.x, this.y, this.width, this.height);
        }
    }

    erase() {
        GameComponent.context.clearRect(this.x, this.y, this.width, this.height);
    }

    resize(size) {
        const centerX = this.x + this.width / 2
        const centerY = this.y + this.height / 2
        this.size = size
        this.height = 40 * size
        this.width = 55 * size
        this.x = centerX - this.width / 2
        this.y = centerY - this.height / 2
    }

    normalizeVelocity() {
        const speed = Math.hypot(this.dx, this.dy)
        if (speed <= 0) {
            this.dx = this.speed
            this.dy = this.speed
            return
        }

        const minSpeed = Math.min(this.minimumComponentSpeed, speed / Math.SQRT2)
        const minAngle = Math.asin(minSpeed / speed)
        const quadrant = Math.floor((((Math.atan2(this.dy, this.dx) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI / 2))
        const quadrantStart = quadrant * Math.PI / 2
        const localAngle = (((Math.atan2(this.dy, this.dx) - quadrantStart) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
        const clampedAngle = quadrantStart + Math.max(minAngle, Math.min(Math.PI / 2 - minAngle, localAngle))

        this.dx = Math.cos(clampedAngle) * speed
        this.dy = Math.sin(clampedAngle) * speed
    }
}
