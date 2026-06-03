const characters = {
    hero: { name: "주인공", portrait: "../images/nyancat-1.png" },
    villain: { name: "악당", portrait: "../images/nyancat-2.svg" },
    girlfriend: { name: "여친", portrait: "character3.jpg" }
};

const dialogueScript = [
    { character: characters.villain, text: "흐흐흐... 드디어 여기까지 왔군, 애송이. 하지만 너무 늦었어.", portraitId: "villainPortrait" },
    { character: characters.hero, text: "악당! 그녀는 어디 있나? 당장 그녀를 돌려받아야겠어!", portraitId: "heroPortrait" },
    { character: characters.villain, text: "돌려달라고? 아니면... 저 쓸모없는 계집을 구하러 온 건가?", portraitId: "villainPortrait" },
    { character: characters.hero, text: "닥쳐! 너의 비열한 계획에 그녀를 이용하게 두지 않겠다. 내 목숨을 걸고서라도 그녀를 찾을 것이다!", portraitId: "heroPortrait" },
    { character: characters.girlfriend, text: "주인공...! 오지 마세요! 이건 함정이에요...!", portraitId: "girlfriendPortrait" },
    { character: characters.hero, text: "여친! 기다려, 내가 지금 갈게!", portraitId: "heroPortrait" },
    { character: characters.villain, text: "하하하! 감동적이군. 그럼 어디 실력 발휘 좀 해보시지!", portraitId: "villainPortrait" }
];

let currentLine = 0;

const updateDialogue = () => {
    const nameLabel = document.getElementById("charName");
    const textBox = document.getElementById("dialogueText");
    const nextBtn = document.getElementById("nextBtn");

    if (currentLine >= dialogueScript.length) {
        nameLabel.textContent = "";
        textBox.textContent = "== 대화 종료. 전투가 시작됩니다! ==";    
        nextBtn.style.display = "none";

        document.getElementById("heroPortrait").className = "portrait-img inactive-portrait";
        document.getElementById("villainPortrait").className = "portrait-img inactive-portrait";
        document.getElementById("girlfriendPortrait").className = "portrait-img inactive-portrait";

        document.querySelector(".left-portrait").style.display = "none";
        document.querySelector(".right-portrait").style.display = "none";

        return;
    }
    const line = dialogueScript[currentLine];

    nameLabel.textContent = line.character.name;
    textBox.textContent = line.text;

    const heroPortrait = document.getElementById("heroPortrait");
    const villainPortrait = document.getElementById("villainPortrait");
    const girlfriendPortrait = document.getElementById("girlfriendPortrait");

    heroPortrait.className = "portrait-img inactive-portrait";
    villainPortrait.className = "portrait-img inactive-portrait";
    girlfriendPortrait.className = "portrait-img inactive-portrait";

    heroPortrait.src = characters.hero.portrait;
    villainPortrait.src = characters.villain.portrait;
    girlfriendPortrait.src = characters.girlfriend.portrait;

    const activePortrait = document.getElementById(line.portraitId);
    activePortrait.className = "portrait-img active-portrait";

    currentLine++;
}

const startScene = () => {
    document.getElementById("dialogueBox").classList.add("active");
    updateDialogue();
}

document.getElementById("nextBtn").addEventListener("click", updateDialogue);

window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault();

        if (document.getElementById("nextBtn").style.display !== "none") {
            updateDialogue();
        }
    }
});

window.onload = () => {
    setTimeout(startScene, 300);
};