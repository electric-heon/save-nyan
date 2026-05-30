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
}