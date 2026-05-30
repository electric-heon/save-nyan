document.addEventListener('DOMContentLoaded', () => {
    const settingPopup = document.querySelector(".setting_popup")
    const settingBtn = document.querySelector(".setting")

    
    settingBtn.addEventListener('click', () => {
        settingPopup.style.display = "flex"
    })
})
