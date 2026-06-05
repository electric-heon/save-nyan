const characters = {
    hero: { name: "주인공", portrait: "character1.jpg" },
    villain: { name: "악당", portrait: "character2.jpg" },
    girlfriend: { name: "여친", portrait: "character3.jpg" }
};

const dialogueScript = [
    { character: characters.villain, text: "하하... 드디어 여기까지 왔군. 하지만 이미 늦었다.", portraitId: "villainPortrait" },
    { character: characters.hero, text: "악당! 그녀는 어디 있지? 당장 그녀를 돌려줘!", portraitId: "heroPortrait" },
    { character: characters.villain, text: "돌려달라고? 어림도 없지. 나는 그녀를 내 시종으로 부릴것이다.", portraitId: "villainPortrait" },
    { character: characters.hero, text: "그만둬! 그녀를 이용하게 두지 않겠어!", portraitId: "heroPortrait" },
    { character: characters.girlfriend, text: "주인공...! 오지마! 이건 위험한 함정이야..!", portraitId: "girlfriendPortrait" },
    { character: characters.hero, text: "여친! 기다려, 내가 지금 구하러 갈게!", portraitId: "heroPortrait" },
    { character: characters.villain, text: "크하하! 정말 눈물겹군. 그럼 어디 실력 발휘 좀 해보시지!", portraitId: "villainPortrait" },
    { character: characters.hero, text: "거기서!!!", portraitId: "heroPortrait" }
];

let currentLine = 0;

function updateDialogue() {
    const nameLabel = document.getElementById("charName");
    const textBox = document.getElementById("dialogueText");
    const nextBtn = document.getElementById("nextBtn");

    if (currentLine >= dialogueScript.length) {
        nameLabel.textContent = "";
        textBox.textContent = "== 대화 종료. 전투가 시작됩니다! ==";
        nextBtn.style.display = "none";
        document.getElementById("dialogueBox").classList.remove("active");
        return;
    }
    
    const line = dialogueScript[currentLine];

    nameLabel.textContent = line.character.name;
    textBox.textContent = line.text;

    const heroPortrait = document.getElementById("heroPortrait");
    const villainPortrait = document.getElementById("villainPortrait");
    const girlfriendPortrait = document.getElementById("girlfriendPortrait");

    heroPortrait.src = characters.hero.portrait;
    villainPortrait.src = characters.villain.portrait;
    girlfriendPortrait.src = characters.girlfriend.portrait;

    if (currentLine === 7) { 
        villainPortrait.classList.add("escape-right");
        girlfriendPortrait.classList.add("escape-right");
        heroPortrait.className = "portrait-img active-portrait chase-out-right";
    } else {
        heroPortrait.className = "portrait-img inactive-portrait";
        villainPortrait.className = "portrait-img inactive-portrait";
        girlfriendPortrait.className = "portrait-img inactive-portrait";

        const activeCharacter = document.getElementById(line.portraitId);
        if (activeCharacter) {
            activeCharacter.className = activeCharacter.className.replace("inactive-portrait", "active-portrait");
        }
    }

    currentLine++;
}

function startScene() {
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
