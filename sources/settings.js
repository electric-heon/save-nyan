class Settings extends HTMLElement {
    constructor() {
        super()

        this.musicList = ["Nyan", "Space", "Retro"]
        this.selectedCat = localStorage.getItem("catSkin") || "cherry"
        this.selectedPoptart = localStorage.getItem("poptartSkin") || "cherry"
        this.selectedMusic = localStorage.getItem("music") || this.musicList[0]
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="setting_popup">
                <div id="setting_title">SETTING</div>
                <div id="setting_list">
                    <div class="setting_list_item">
                        <div class="setting_list_texts">
                            <div class="setting_list_title">Pop Tarts</div>
                            <div class="setting_list_description">팝타르트 종류</div>
                        </div>
                        <div class="setting_menu">
                            <input name="poptart" id="cherry" type="radio" value="cherry"/>
                            <input name="poptart" id="oreo" type="radio" value="oreo"/>
                            <label for="cherry">
                                <div class="setting_menu_item">Cherry</div>
                            </label>
                            <label for="oreo">
                                <div class="setting_menu_item">Oreo</div>
                            </label>
                        </div>
                    </div>
                    <div class="setting_list_item">
                        <div class="setting_list_texts">
                            <div class="setting_list_title">Skins</div>
                            <div class="setting_list_description">고양이 스킨 선택</div>
                        </div>
                        <div class="setting_menu">
                            <input name="cats" id="cherrycat" type="radio" value="cherry"/>
                            <input name="cats" id="oreocat" type="radio" value="oreo"/>
                            <label for="cherrycat">
                                <div class="setting_menu_item">Cherry</div>
                            </label>
                            <label for="oreocat">
                                <div class="setting_menu_item">Oreo</div>
                            </label>
                        </div>
                    </div>
                    <div class="setting_list_item">
                        <div class="setting_list_texts">
                            <div class="setting_list_title">Music</div>
                            <div class="setting_list_description">배경 음악 선택</div>
                        </div>
                        <div class="setting_music">
                            <div class="left">&lt;</div>
                            <div class="music_title"></div>
                            <div class="right">&gt;</div>
                        </div>
                    </div>
                </div>
                <div class="setting_buttons">
                    <div class="setting_confirm">OK</div>
                    <div class="setting_cancel">Cancel</div>
                </div>
            </div>`

        this.settingPopup = this.querySelector(".setting_popup")
        this.confirmBtn = this.querySelector(".setting_confirm")
        this.cancelBtn = this.querySelector(".setting_cancel")
        this.musicTitle = this.querySelector(".music_title")
        this.leftBtn = this.querySelector(".left")
        this.rightBtn = this.querySelector(".right")

        this.bindEvents()
        this.loadSavedSettings()
        this.render()
    }

    bindEvents() {
        this.querySelectorAll('input[name="cats"]').forEach(radio => {
            radio.addEventListener("change", () => {
                if (radio.checked) {
                    this.selectedCat = radio.value
                }
            })
        })

        this.querySelectorAll('input[name="poptart"]').forEach(radio => {
            radio.addEventListener("change", () => {
                if (radio.checked) {
                    this.selectedPoptart = radio.value
                }
            })
        })

        this.leftBtn.addEventListener("click", () => this.changeMusic(-1))
        this.rightBtn.addEventListener("click", () => this.changeMusic(1))

        this.confirmBtn.addEventListener("click", () => {
            this.saveSettings()
            this.close()
        })

        this.cancelBtn.addEventListener("click", () => {
            this.loadSavedSettings()
            this.render()
            this.close()
        })
    }

    loadSavedSettings() {
        this.selectedCat = localStorage.getItem("catSkin") || "cherry"
        this.selectedPoptart = localStorage.getItem("poptartSkin") || "cherry"
        this.selectedMusic = localStorage.getItem("music") || this.musicList[0]
    }

    saveSettings() {
        localStorage.setItem("catSkin", this.selectedCat)
        localStorage.setItem("poptartSkin", this.selectedPoptart)
        localStorage.setItem("music", this.selectedMusic)

        window.dispatchEvent(new CustomEvent("settingsChanged", {
            detail: {
                catSkin: this.selectedCat,
                poptartSkin: this.selectedPoptart,
                music: this.selectedMusic,
            },
        }))
    }

    changeMusic(direction) {
        const currentIndex = this.musicList.indexOf(this.selectedMusic)
        const nextIndex = (currentIndex + direction + this.musicList.length) % this.musicList.length
        this.selectedMusic = this.musicList[nextIndex]
        this.renderMusic()
    }

    render() {
        const catInput = this.querySelector(`input[name="cats"][value="${this.selectedCat}"]`)
        const poptartInput = this.querySelector(`input[name="poptart"][value="${this.selectedPoptart}"]`)

        if (catInput) {
            catInput.checked = true
        }

        if (poptartInput) {
            poptartInput.checked = true
        }

        this.renderMusic()
    }

    renderMusic() {
        this.musicTitle.textContent = this.selectedMusic
    }

    open() {
        this.loadSavedSettings()
        this.render()
        this.settingPopup.style.display = "flex"
    }

    close() {
        this.settingPopup.style.display = "none"
    }
}

customElements.define("game-settings", Settings)

document.addEventListener("DOMContentLoaded", () => {
    const gameSettings = document.querySelector("game-settings")
    const settingBtn = document.querySelector(".setting")
    const pauseSettingBtn = document.querySelector("#setting_button")

    if (settingBtn && gameSettings) {
        settingBtn.addEventListener("click", () => gameSettings.open())
    }

    if (pauseSettingBtn && gameSettings) {
        pauseSettingBtn.addEventListener("click", () => gameSettings.open())
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && gameSettings) {
            gameSettings.close()
        }
    })
})
