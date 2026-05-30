window.addEventListener("load", () => {

    GameComponent.init()
	const game = new Game
    game.start()

    const retryBtn = document.querySelector('#retry')
    const quitBtn = document.querySelector('#quit')
    const gameOverPopup = document.querySelector('.game_over')

    retryBtn.addEventListener('click', () => {
        gameOverPopup.style.display = 'none'
        game.reset()
        game.start()        
    })

    quitBtn.addEventListener('click', () => {
        window.location.replace("main.html");
    })


    const pauseMenu = document.querySelector(".menu")
    const menuResumeBtn = document.querySelector('#resume_button')
    const menuSettingBtn = document.querySelector('#setting_button')
    const menuQuitBtn = document.querySelector('#quit_button')
    
    window.addEventListener('keydown', (e) => {
        if (e.key == 'Escape') {
            console.log("esc")
            pauseMenu.style.display = 'flex'
            game.pause()
        }
    })

    menuResumeBtn.addEventListener('click', () => {
        pauseMenu.style.display = 'none'
        game.play()
    })

    menuQuitBtn.addEventListener('click', () => {
        window.location.replace("main.html")
    })
});


class Game extends GameComponent {
    constructor() {
        super()
        this.level = 1
        this.catSpeed = 3
        this.barSpeed = 15
        this.bar = new Bar(30, 250, 15, 100, this.barSpeed)
        this.cat = new NyanCat(80, 270, this.catSpeed, "cherry")
        this.popTartManager = new PoptartManager(6, 4, 10, this.level)
        this.score = 0
        this.life = 3
        this.combo = 0
        this.maxCombo = 0

        this.tensec = 0
        this.sec = 0
        this.min = 0

        this.requestID = null
        this.isPlaying = false
        this.isStarted = false
        this.isResetting = false
    }

    reset() {
        this.bar = new Bar(30, 250, 15, 100, 15)
        this.cat = new NyanCat(80, 270, this.catSpeed, "cherry")
        this.popTartManager = new PoptartManager(6, 4, 10, this.level)
        this.score = 0
        this.life = 3
        this.combo = 0
        this.updateGameState()
    }

    pause() {
        cancelAnimationFrame(this.requestID)
        this.isPlaying = false
    }

    levelUp() {
        this.level++

        switch(this.level) {
            case 2:
                this.catSpeed = 5
                this.barSpeed = 20
                break
            case 3:
                this.catSpeed = 7
                this.barSpeed = 24
                break
            case 4:
                this.catSpeed = 9
                this.barSpeed = 30
                break
        }

        this.reset()
    }

    updateCat() {        
        this.cat.draw();

        if (this.popTartManager.isCleared()) {
            cancelAnimationFrame(this.requestID)
            this.isPlaying = false
            this.levelUp()
            this.start()
            return
        }

        //오른쪽 벽 충돌 시 방향 전환
        if (this.cat.x + this.cat.width> GameComponent.canvasWidth) {
            this.cat.dx *= -1;
        }
        //상하 벽 충돌 시 방향 전환
        if (this.cat.y + this.cat.height> GameComponent.canvasHeight || this.cat.y < 0) {
            this.cat.dy *= -1;
        }
        //왼쪽 벽 충돌 시
        if(!this.isResetting && this.cat.x < 0){
            this.life--
            if (this.life == 0) {
                cancelAnimationFrame(this.requestID)
                this.isPlaying = false
                this.isStarted = false

                const gameOverPopup = document.querySelector('.game_over')
                const gaemOverScore = document.querySelector('#gameover_score')
                const gameOverMaxCombo = document.querySelector('#gameover_maxcombo')

                gameOverPopup.style.display = 'flex'
                gaemOverScore.innerHTML = this.score
                gameOverMaxCombo.innerHTML = this.maxCombo
            } else {
                this.bar.erase()
                this.cat.erase()
                cancelAnimationFrame(this.requestID)
                this.isResetting = true
                setTimeout(() => {
                    this.combo = 0
                    this.cat.reset()
                    this.bar.reset()
                    this.isPlaying = false
                    this.start()
                    this.isResetting = false
                }, 1000)
            }
        }

        if (this.bar.collidesWith(this.cat)) {
            this.combo = 0
            const axis = this.bar.collisionAxis(this.cat)
            if (axis == 'x') {
                this.cat.dx *= -1
            } else if (axis == 'y') {
                this.cat.dy *= -1
            }
        }

        if (this.popTartManager.handleCollision(this.cat)) {
            this.combo++
            this.score += this.combo * 7

            this.maxCombo = Math.max(this.combo, this.maxCombo)
        }

        if (!this.isResetting) {
            this.cat.x += this.cat.dx;
            this.cat.y += this.cat.dy;
        } else {
        }
    }

    updateGameState() {
        const life = document.querySelector("#life")
        const score = document.querySelector("#score")
        const combo = document.querySelector("#combo")
        const level = document.querySelector('#level')

        life.innerHTML = `Life: ${this.life}`
        score.innerHTML = `Score: ${this.score}`
        combo.innerHTML = `Combo: ${this.combo}`
        level.innerHTML = `Level ${this.level}`
    }

    play() {
        if (!this.isStarted) {
            return
        }

        this.isPlaying = true;
    	GameComponent.context.clearRect(0, 0, GameComponent.canvasWidth, GameComponent.canvasHeight);
        if (!this.isResetting) {
            this.updateCat()
            if (!this.isPlaying) return;
            this.bar.update(key);
            this.popTartManager.draw();
            this.updateGameState()
    	    this.requestID = requestAnimationFrame(() => this.play());
        }
    }

    start() {
        GameComponent.context.clearRect(0, 0, GameComponent.canvasWidth, GameComponent.canvasHeight);
        this.updateGameState()
        this.bar.update(key);
        this.popTartManager.draw();
        this.cat.draw()
        window.addEventListener("keydown", (e) => {
            if (e.key === ' ' || e.key === 'Spacebar') {
                if (!this.isPlaying) {
                    this.isStarted = true;
                    this.play()
                }
            }
        })
    }
}