window.addEventListener("load", () => {

    GameComponent.init()
    const catSkin = localStorage.getItem("catSkin") || "cherry";
    const poptartSkin = localStorage.getItem("poptartSkin") || "cherry";
	const game = new Game(catSkin, poptartSkin)
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

    const settingPopup = document.querySelector('.setting_popup')

    menuSettingBtn.addEventListener('click', () => {
        settingPopup.style.display = 'flex'
    })
});


class Game extends GameComponent {
    constructor(catSkin, poptartSkin) {
        super()
        this.catSkin
        this.poptartSkin
        this.level = 1
        this.catSpeed = 3
        this.barSpeed = 15
        this.bar = new Bar(30, 250, 15, 100, this.barSpeed)
        this.cat = new NyanCat(80, 270, this.catSpeed, this.catSkin)
        this.popTartManager = new PoptartManager(6, 4, 10, this.level, this.poptartSkin)
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

        this.wormholeA = new Wormhole(150, 150, 100, 100, 'A');
        this.wormholeB = new Wormhole(850, 400, 100, 100, 'B');
    }

    reset() {
        this.bar = new Bar(30, 250, 15, 100, 15)
        this.cat = new NyanCat(80, 270, this.catSpeed, this.catSkin)
        this.popTartManager = new PoptartManager(6, 4, 10, this.level, this.poptartSkin)
        this.score = 0
        this.life = 3
        this.combo = 0
        this.updateGameState()

        this.wormholeA = new Wormhole(150, Math.random() *100, 100, 100, 'A');
        this.wormholeB = new Wormhole(850, Math.random() * (GameComponent.canvasHeight - 100), 100, 100, 'B');
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
        
        // 1. 웜홀 그리기 및 충돌 체크
    this.wormholeA.draw();
    this.wormholeB.draw();

    let startWH = null;
    let targetWH = null;

    // 웜홀 A에 닿으면 B로 돌진, B에 닿으면 A로 돌진
    if (this.wormholeA.collidesWith(this.cat)) {
        startWH = this.wormholeA;
        targetWH = this.wormholeB;
    } else if (this.wormholeB.collidesWith(this.cat)) {
        startWH = this.wormholeB;
        targetWH = this.wormholeA;
    }

    if (startWH && targetWH) {
        this.cat.isWormhole = true; // 돌진 상태 활성화

        // 방향 계산 (목표 웜홀 중심 방향)
        const diffX = targetWH.x - this.cat.x;
        const diffY = targetWH.y - this.cat.y;
        const angle = Math.atan2(diffY, diffX);
        
        const rushSpeed = this.catSpeed * 4; // 4배 속도
        this.cat.dx = Math.cos(angle) * rushSpeed;
        this.cat.dy = Math.sin(angle) * rushSpeed;

        // 사용 완료 후 비활성화
        this.wormholeA.isActive = false;
        this.wormholeB.isActive = false;
    }

    // 2. 오른쪽 벽 충돌 시 돌진 해제 
    if (this.cat.x + this.cat.width > GameComponent.canvasWidth) {
        
        this.cat.x = GameComponent.canvasWidth - this.cat.width;
        
        if (this.cat.isWormhole) {
            this.cat.isWormhole = false; // 돌진 해제
            this.cat.dx = -this.catSpeed; // 원래 속도로 반사
            this.cat.dy = (this.cat.dy > 0 ? 1 : -1) * this.catSpeed;
        } else {
            this.cat.dx *= -1;
        }
    }
        this.cat.draw();

        if (this.popTartManager.isCleared()) {
            cancelAnimationFrame(this.requestID)
            this.isPlaying = false
            this.levelUp()
            this.start()
            return
        }

        //오른쪽 벽 충돌 시 방향 전환 필요 없을 듯
        // if (this.cat.x + this.cat.width> GameComponent.canvasWidth) {
        //     this.cat.dx *= -1;
        // }
        
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