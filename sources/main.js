document.addEventListener('DOMContentLoaded', () => {
    const settingPopup = document.querySelector(".setting_popup")
    const settingBtn = document.querySelector(".setting")
    const mainBgm = new Audio("bgm/Nyan Nyan Cat - Poptart Cat.mp3")
    mainBgm.loop = true
    mainBgm.volume = 0.45

    const playMainBgm = () => {
        mainBgm.play().catch(() => {})
    }

    playMainBgm()
    document.addEventListener("click", playMainBgm, { once: true })
    document.addEventListener("keydown", playMainBgm, { once: true })

    
    settingBtn.addEventListener('click', () => {
        settingPopup.style.display = "flex"
    })
})
