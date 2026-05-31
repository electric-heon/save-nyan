document.addEventListener("DOMContentLoaded", () => {
    const settingConfirmBtn = document.querySelector(".setting_confirm")
    const settingCancelBtn = document.querySelector(".setting_cancel")
    const settingPopup = document.querySelector(".setting_popup")

    settingCancelBtn.addEventListener("click", () => {
        settingPopup.style.display = "none"
    })
})



class Settings extends HTMLElement {
    constructor () {
        super()
    }

    connectedCallback() {
        this.innerHTML = `    
            <div class="setting_popup">
                <div id="setting_title">SETTING</div>
                <div id="setting_list">
                    <div class="setting_list_item">
                        <div class="setting_list_texts">
                            <div class="setting_list_title">Pop Tarts</div>
                            <div class="setting_list_description">팝 타르트 종류</div>
                        </div>
                        <div class="setting_menu">
                            <input name="poptart" id="cherry" type="radio" checked="checked"/>
                            <input name="poptart" id="oreo" type="radio"/>
                            <label for="cherry">
                                <div class="setting_menu_item">Cherry</div>
                            </label>
                            <label for="oreo">
                                <div class="setting_menu_item"> Oreo </div>
                            </label>
                        </div>
                    </div>
                    <div class="setting_list_item">
                        <div class="setting_list_texts">
                            <div class="setting_list_title">Skins</div>
                            <div class="setting_list_description">고양이 스킨 선택</div>
                        </div>
                        <div class="setting_menu">
                            <input name="cats" id="cherrycat" type="radio" checked="checked"/>
                            <input name="cats" id="oreocat" type="radio"/>
                            <label for="cherrycat">
                                <div class="setting_menu_item">Cherry</div>
                            </label>
                            <label for="oreocat">
                                <div class="setting_menu_item"> Oreo </div>
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
                    <div class="setting_confirm">
                        OK
                    </div>
                    <div class="setting_cancel">
                        Cancel
                    </div>
                </div>
            </div>`
    }
}

customElements.define('game-settings', Settings)