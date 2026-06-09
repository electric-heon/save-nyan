window.addEventListener("load", async () => {

    GameComponent.init()

    // 이미지 미리 로드
    await Planet.preload()
    await Poptart.preload()
    await Wormhole.preload()

    const catSkin = localStorage.getItem("catSkin") || "cherry";

    let poptartSkin = localStorage.getItem("poptartSkin") || "cherry"
    

    const game = new Game(catSkin, poptartSkin)
    if (localStorage.getItem('pendingLevelUp')) {
        localStorage.removeItem('pendingLevelUp')
        game.levelUp()
    }
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

    const nextStageBtn = document.querySelector('#next_stage')
    const stageClearQuitBtn = document.querySelector('#stageclear_quit')
    const stageClearPopup = document.querySelector('.stage_clear')

    nextStageBtn.addEventListener('click', () => {
        stageClearPopup.style.display = 'none'
        localStorage.setItem('pendingLevelUp', 'true')
        localStorage.setItem('charaLevel', String(game.level))
        window.location.replace('chara.html')
    })

    stageClearQuitBtn.addEventListener('click', () => {
        window.location.replace("main.html")
    })

    const pauseMenu = document.querySelector(".menu")
    const menuResumeBtn = document.querySelector('#resume_button')
    const menuSettingBtn = document.querySelector('#setting_button')
    const menuQuitBtn = document.querySelector('#quit_button')
    const settingPopup = document.querySelector('.setting_popup')

    window.addEventListener('keydown', (e) => {
        if (e.key == 'Escape') {
            if (settingPopup)
            
            pauseMenu.style.display = 'flex'
            game.pause()
        }
    })

    window.addEventListener('blur', () => {
        pauseMenu.style.display = 'flex'
        game.pause()
    })

    menuResumeBtn.addEventListener('click', () => {
        pauseMenu.style.display = 'none'
        game.play()
    })

    menuQuitBtn.addEventListener('click', () => {
        window.location.replace("main.html")
    })

    menuSettingBtn.addEventListener('click', () => {
        settingPopup.style.display = 'flex'
    })
});

// 게임 진행
class Game extends GameComponent {
    constructor(catSkin, poptartSkin) {
        super()
        this.catSkin = catSkin
        this.poptartSkin = poptartSkin
        this.level = Math.max(1, parseInt(localStorage.getItem('charaLevel') || '1'))
        this.catSpeed = 5
        this.barSpeed = 15
        this.bar = new Bar(30, 250, 15, 100, this.barSpeed)

        // 웜홀 객체 초기화
        this.wormholeA = new Wormhole(60, 60, 'entrance');
        this.wormholeB = new Wormhole(60, 60, 'exit');

        this.cat = new NyanCat(80, 282, this.catSpeed, this.catSkin)
        this.popTartManager = new PoptartManager(5, 5, 10, this.level, this.poptartSkin)
        this.planetManager = new PlanetManager(this.level)

        this.score = 0
        this.life = 3
        this.combo = 0
        this.maxCombo = 0
        this.sizeStep = 0.02
        this.size = 1

        this.tensec = 0
        this.sec = 0
        this.min = 0

        this.requestID = null
        this.isPlaying = false
        this.isStarted = false
        this.isResetting = false

        this.lastTimestamp = null
        this.music = localStorage.getItem("music") || "game_bgm1"
        this.bgm = new Audio(this.getBgmSource(this.music))
        this.bgm.loop = true
        this.bgm.volume = 0.45
        this.lifeDownSound = new Audio("assets/bgm/minus_life.mp3")
        this.deathSound = new Audio("assets/bgm/death_sound.mp3")
        this.lifeDownSound.volume = 0.7
        this.deathSound.volume = 0.8


        this.ui = {
            life: document.querySelector("#life"),
            score: document.querySelector("#score"),
            combo: document.querySelector("#combo"),
            level: document.querySelector("#level"),
        }

        window.addEventListener("settingsChanged", (e) => {
            this.applySettings(e.detail)
        })
        
        // 스페이스바 입력 이벤트 발생 시 게임 플레이 시작
        window.addEventListener("keydown", (e) => {
            if (e.key === ' ' || e.key === 'Spacebar') {
                if (!this.isPlaying) {
                    this.isStarted = true;
                    this.play()
                }
            }
        })

        // [시연용] 'c' 키 입력 시 현재 스테이지 즉시 클리어
        window.addEventListener("keydown", (e) => {
            if (e.key === 'c' || e.key === 'C') {
                if (this.isStarted) {
                    if (this.level == 5) {
                        // 마지막 스테이지: 남은 팝타르트를 제거해 엔딩 연출 중 고양이가 가려지지 않도록 함
                        this.popTartManager.clearAll()
                        // play 루프에서 finalClear가 매 프레임 호출되도록 플래그 설정
                        this.forceFinalClear = true
                    } else {
                        this.showStageClear()
                    }
                }
            }
        })
    }

    // 스테이지 클리어 처리 (팝타르트 모두 획득 시 또는 시연용 단축키)
    showStageClear() {
        cancelAnimationFrame(this.requestID)
        this.isPlaying = false
        this.isStarted = false

        const stageClearPopup = document.querySelector('.stage_clear')
        const stageClearScore = document.querySelector('#stageclear_score')
        const stageClearMaxCombo = document.querySelector('#stageclear_maxcombo')

        stageClearPopup.style.display = 'flex'
        stageClearScore.innerHTML = this.score
        stageClearMaxCombo.innerHTML = this.maxCombo
    }

    applySettings(settings) {
        if (!settings) {
            return
        }

        if (settings.catSkin) {
            this.catSkin = settings.catSkin
            this.cat.setSkin(this.catSkin)
        }

        if (settings.poptartSkin) {
            this.poptartSkin = settings.poptartSkin
            this.popTartManager.setSkin(this.poptartSkin)
        }

        if (settings.music) {
            this.setBgm(settings.music, this.isPlaying)
        }

        if (!this.isPlaying) {
            this.start()
        }
    }

    getBgmSource(musicName) {
        return `assets/bgm/${musicName}.mp3`
    }

    setBgm(musicName, shouldPlay = false) {
        if (this.music === musicName) {
            return
        }

        this.stopBgm()
        this.music = musicName
        this.bgm = new Audio(this.getBgmSource(this.music))
        this.bgm.loop = true
        this.bgm.volume = 0.45

        if (shouldPlay) {
            this.playBgm()
        }
    }

    playBgm(ignoreResetting = false) {
        if (!this.bgm || !this.isStarted || (!ignoreResetting && this.isResetting)) {
            return
        }

        this.bgm.play().catch(() => {})
    }

    pauseBgm() {
        if (this.bgm) {
            this.bgm.pause()
        }
    }

    stopBgm() {
        if (this.bgm) {
            this.bgm.pause()
            this.bgm.currentTime = 0
        }
    }

    playSound(sound, pauseGameBgm = false, resumeGameBgm = false) {
        if (!sound) {
            return
        }

        if (pauseGameBgm) {
            this.pauseBgm()
        }

        sound.onended = () => {
            sound.onended = null

            if (resumeGameBgm && this.isStarted && this.life > 0) {
                this.playBgm(true)
            }
        }
        sound.currentTime = 0
        sound.play().catch(() => {
            sound.onended = null

            if (resumeGameBgm && this.isStarted && this.life > 0) {
                this.playBgm(true)
            }
        })
    }

    // 게임 초기화(게임오버)
    reset() {
        this.bar = new Bar(30, 250, 15, 100, this.barSpeed)
        this.cat = new NyanCat(80, 282, this.catSpeed, this.catSkin)
        this.popTartManager = new PoptartManager(5, 5, 10, this.level, this.poptartSkin)
        this.planetManager = new PlanetManager(this.level)
        this.score = 0
        this.life = 3
        this.combo = 0
        this.size = 1
        this.updateGameState()
        this.wormholeA.reset()
        this.wormholeB.reset()
    }

    // 왼쪽 벽 충돌 시 처리 
    handleCatCrash() {
        this.life--

        // 수명 0 도달 시 게임 오버 화면 표시
        if (this.life == 0) {
            cancelAnimationFrame(this.requestID)
            this.isPlaying = false
            this.isStarted = false
            this.stopBgm()
            this.playSound(this.deathSound, true, false)

            const gameOverPopup = document.querySelector('.game_over')
            const gaemOverScore = document.querySelector('#gameover_score')
            const gameOverMaxCombo = document.querySelector('#gameover_maxcombo')

            gameOverPopup.style.display = 'flex'
            gaemOverScore.innerHTML = this.score
            gameOverMaxCombo.innerHTML = this.maxCombo
            return
        }

        cancelAnimationFrame(this.requestID)
        this.isResetting = true
        this.playSound(this.lifeDownSound, true, true)
        this.cat.erase()
        this.bar.erase()
        setTimeout(() => {
            this.combo = 0
            this.cat.reset()
            this.bar.reset()
            this.isPlaying = false
            this.start()
            this.isResetting = false
        }, 1000)
    }

    // 게임 중 esc 키 입력 시 일시정지 처리
    pause() {
        cancelAnimationFrame(this.requestID)
        this.isPlaying = false
        this.lastTimestamp = null
        this.pauseBgm()
    }

    // 레벨 증가 시 난이도 조절
    levelUp() {
        this.level++
        localStorage.setItem('charaLevel', String(this.level))

        switch(this.level) {
            case 2:
                this.catSpeed = 5
                this.barSpeed = 20
                break
            case 3:
                this.catSpeed = 6
                this.barSpeed = 22
                break
            case 4:
                this.catSpeed = 7
                this.barSpeed = 24
                break
            case 5:
                this.catSpeed = 8
                this.barSpeed = 28
                break
        }

        this.reset()
    }


    // 고양이 동작 업데이트
    updateCat() {              
        
        // 스테이지 클리어 확인
        if (this.forceFinalClear || this.popTartManager.isCleared()) {
            if(this.level == 5) {
                this.finalClear();
                return;
            }
            this.showStageClear()
            return
        }
        
        

        //-----------------------------------------
        // 웜홀 기능 구현
        //-----------------------------------------
        let startWH = null;
        let targetWH = null;

        // 웜홀 A에 닿으면 B로 돌진
        if (this.wormholeA.collidesWith(this.cat)) {
            startWH = this.wormholeA;
            targetWH = this.wormholeB;
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



        
        //----------------------------------------------------------------
        // 충돌 시 처리
        //----------------------------------------------------------------
        // 1. 오른쪽 벽 충돌 
        if (this.cat.x + this.cat.width > GameComponent.canvasWidth) {
            
            this.cat.x = GameComponent.canvasWidth - this.cat.width;
            if (this.cat.isWormhole) {
                this.cat.isWormhole = false; // 돌진 해제
                this.cat.dx = -this.catSpeed; // 원래 속도로 반사
                // 돌진 중 커진 dy를 부호를 유지하며 원래 속도 크기로 복원 (dy가 0이면 NaN 방지)
                const dySign = this.cat.dy < 0 ? -1 : 1;
                this.cat.dy = dySign * this.catSpeed;
            } else {
                this.cat.dx *= -1;
            }   
        }

                
        // 2. 상하 벽 충돌 시 방향 전환
        if (this.cat.y + this.cat.height > GameComponent.canvasHeight) {
            this.cat.dy = -Math.abs(this.cat.dy);
            this.cat.y = GameComponent.canvasHeight - this.cat.height;
        } else if (this.cat.y < 0) {
            this.cat.dy = Math.abs(this.cat.dy);
            this.cat.y = 0;
        }

        // 3. 왼쪽 벽 충돌 시
        if(!this.isResetting && this.cat.x < 0){
            this.handleCatCrash()
            return
        }

        // 4. 행성과 충돌 시
        if (this.planetManager.handleCollision(this.cat)) {
            this.combo = 0
        }

        // 5. 팝타르트와 충돌 시
        if (this.popTartManager.handleCollision(this.cat)) {
            this.combo++
            this.score += this.combo * 7
            this.maxCombo = Math.max(this.combo, this.maxCombo)

            if (this.size < 1.3) {
                this.size += this.sizeStep
                this.cat.resize(this.size)
                if (!this.popTartManager.lastCollisionWasWormhole) {
                    this.popTartManager.resolveOverlap(this.cat)
                }
            }
        }

        // 5. 고양이와 바 충돌시
        if (this.bar.collidesWith(this.cat)) {
            this.combo = 0
            const axis = this.bar.collisionAxis(this.cat)
            if (axis == 'x') {
                this.cat.dx *= -1
                if (this.cat.dx > 0) {
                    this.cat.x = this.bar.x + this.bar.width
                } else {
                    this.cat.x = this.bar.x - this.cat.width
                }
            } else if (axis == 'y') {
                if (this.cat.y + this.cat.height / 2 < this.bar.y + this.bar.height / 2) {
                    this.cat.dy = -Math.abs(this.cat.dy)
                    this.cat.y = this.bar.y - this.cat.height
                } else {
                    this.cat.dy = Math.abs(this.cat.dy)
                    this.cat.y = this.bar.y + this.bar.height
                }
            }
        }



        if (!this.isResetting) {
            // 행성 중력 적용 후 고양이 이동 및 출력
            this.planetManager.applyGravity(this.cat, this._factor);
            this.cat.normalizeVelocity();
            this.cat.rememberPosition();
            this.cat.x += this.cat.dx * this._factor;
            this.cat.y += this.cat.dy * this._factor;
            this.wormholeA.draw();
            this.wormholeB.draw();
            this.cat.draw();
            this.planetManager.draw();
        }
    }

    
    updateGameState() {
        const lifeText  = `Life: ${this.life}`
        const scoreText = `Score: ${this.score}`
        const comboText = `Combo: ${this.combo}`
        const levelText = `Stage ${this.level}`
        if (this.ui.life.textContent  !== lifeText)  this.ui.life.textContent  = lifeText
        if (this.ui.score.textContent !== scoreText) this.ui.score.textContent = scoreText
        if (this.ui.combo.textContent !== comboText) this.ui.combo.textContent = comboText
        if (this.ui.level.textContent !== levelText) this.ui.level.textContent = levelText
    }

    // 게임 플레이 시작
    play(timestamp = performance.now()) {
        if (!this.isStarted) {
            return
        }

        const wasPlaying = this.isPlaying
        if (this.lastTimestamp === null) this.lastTimestamp = timestamp
        // deltaTime을 50ms로 제한해 탭 전환 후 복귀 시 폭발적 이동 방지
        const deltaTime = Math.min(timestamp - this.lastTimestamp, 50)
        this.lastTimestamp = timestamp
        this._factor = deltaTime / (1000 / 60)
        this.isPlaying = true;
        if (!wasPlaying) {
            this.playBgm()
        }

        GameComponent.context.clearRect(0, 0, GameComponent.canvasWidth, GameComponent.canvasHeight);
        if (!this.isResetting) {
            this.requestID = requestAnimationFrame((ts) => this.play(ts));
            this.updateCat()
            if (!this.isPlaying || this.isResetting) return;
            this.bar.update(key, this._factor);
            this.popTartManager.draw();
            this.updateGameState()
        }
    }

    // 게임 화면 로드
    start() {
        GameComponent.context.clearRect(0, 0, GameComponent.canvasWidth, GameComponent.canvasHeight);
        this.updateGameState()
        this.bar.update(key);
        this.wormholeA.draw()
        this.wormholeB.draw()
        this.planetManager.draw();
        this.popTartManager.draw();
        this.cat.draw()
    }

    finalClear() {
        const targetX = 150;
        const targetY = GameComponent.canvasHeight / 2;

        // 화면 초기화 및 배경 그리기
        GameComponent.context.clearRect(0, 0, GameComponent.canvasWidth, GameComponent.canvasHeight);
        this.planetManager.draw();

        // 1. 거리 계산
        const diffX = targetX - this.cat.x;
        const diffY = targetY - this.cat.y;
        const distance = Math.sqrt(diffX * diffX + diffY * diffY);

        // 목표 지점에 도착했고, 크기도 충분히 커졌다면 '오른쪽 대쉬' 모드로 전환
        if (distance <= 1 && this.size >= 3) {
            this.isEndingDash = true; 
        }

        if (!this.isEndingDash) {
            // --- Phase 1: 중앙으로 이동하며 커지기 ---
            if (distance > 1) {
                this.cat.x += diffX * 0.1;
                this.cat.y += diffY * 0.1;
            }
            if (this.size < 3) {
                this.size += 0.02;
                this.cat.resize(this.size);
            }
        } else {
            // --- Phase 2: 오른쪽으로 쭉 이동하기 ---
            this.cat.dx = 15; // 대쉬 속도
            this.cat.x += this.cat.dx;

            if (this.cat.x > GameComponent.canvasWidth + 50) {
                cancelAnimationFrame(this.requestID);
                this.stopBgm();
                localStorage.setItem('charaLevel', '5');
                window.location.replace('chara.html');
                return;
            }
        }

        // 고양이 그리기
        this.cat.draw();
    }
}
