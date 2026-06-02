document.addEventListener("DOMContentLoaded", () => {
    const settingConfirmBtn = document.querySelector(".setting_confirm");
    const settingCancelBtn = document.querySelector(".setting_cancel");
    const settingPopup = document.querySelector(".setting_popup");

    const catSkin = document.querySelectorAll('input[name="cats"]');
    const poptartSkin = document.querySelectorAll('input[name="poptart"]');

    let selectedCat = localStorage.getItem("catSkin") || "cherry";
    let selectedPoptart = localStorage.getItem("poptartSkin") || "cherry";

    catSkin.forEach(radio => {
        radio.addEventListener("change", () => {
            if (radio.checked) {
                selectedCat = radio.value;
            }
        });
    });

    poptartSkin.forEach(radio => {
        radio.addEventListener("change", () => {
            if (radio.checked) {
                selectedPoptart = radio.value;
            }
        });
    });

    // 확인 버튼 이벤트
    if (settingConfirmBtn) {
        settingConfirmBtn.addEventListener("click", () => {
            localStorage.setItem("catSkin", selectedCat);
            localStorage.setItem("poptartSkin", selectedPoptart);
            settingPopup.style.display = "none";
        });
    }

    // 취소 버튼 이벤트
    if (settingCancelBtn) {
        settingCancelBtn.addEventListener("click", () => {
            settingPopup.style.display = "none";
        });
    }

    // ESC 키 이벤트
    document.addEventListener("keydown", (e) => {
        if (e.key === 'Escape' && settingPopup) {
            settingPopup.style.display = "none";
        }
    });
}); // <--- DOMContentLoaded 이벤트 끝

// 아래는 클래스 정의 부분입니다 (이벤트 리스너 밖에 있어야 함)
class Settings extends HTMLElement {
    constructor () {
        super();
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
                            <input name="poptart" id="cherry" type="radio" value="cherry" checked="checked"/>
                            <input name="poptart" id="oreo" type="radio" value="oreo"/>
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
                            <input name="cats" id="cherrycat" type="radio" value="cherry" checked="checked"/>
                            <input name="cats" id="oreocat" type="radio" value="oreo" />
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
            </div>`;
    }
}

// 클래스 등록 (이게 있어야 에러가 안 납니다)
customElements.define('game-settings', Settings);