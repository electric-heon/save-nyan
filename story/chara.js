const characters = {
    hero: { name: "Nyan Cat", portrait: "character1.jpg" },
    villain: { name: "Dark Choco Cat", portrait: "character2.jpg" },
    girlfriend: { name: "Cream Cat", portrait: "character3.jpg" }
};

const dialogueScript = [
    { character: characters.villain, text: "하하... 드디어 여기까지 왔군. 하지만 이미 늦었다.", portraitId: "villainPortrait" },
    { character: characters.hero, text: "Dark Choco Cat! Cream Cat는 어디 있지? 당장 그녀를 돌려줘!", portraitId: "heroPortrait" },
    { character: characters.villain, text: "돌려달라고? 어림도 없지. 나는 그녀를 내 시종으로 부릴것이다.", portraitId: "villainPortrait" },
    { character: characters.hero, text: "그만둬! Cream Cat를 이용하게 두지 않겠어!", portraitId: "heroPortrait" },
    { character: characters.girlfriend, text: "Nyan Cat...! 오지마! 이건 위험한 함정이야..!", portraitId: "girlfriendPortrait" },
    { character: characters.hero, text: "여친! 기다려, 내가 지금 구하러 갈게!", portraitId: "heroPortrait" },
    { character: characters.villain, text: "크하하! 정말 눈물겹군. 그럼 어디 실력 발휘 좀 해보시지!", portraitId: "villainPortrait" },
    { character: characters.hero, text: "거기서!!!", portraitId: "heroPortrait" },
    { character: null, text: "", portraitId: "chaseAction" },
    { character: characters.villain, text: "크윽 내가 따라잡히다니", portraitId: "villainPortrait" },
    { character: null, text: "", portraitId: "villainVanished" },
    { character: null, text: "", portraitId: "heroMeet" },
    { character: { name: "", portrait: "" }, text: "그렇게 행복하게 살았습니다", portraitId: "" }
];

let currentLine = 0;

function updateDialogue() {
    const nameLabel = document.getElementById("charName");
    const textBox = document.getElementById("dialogueText");
    const nextBtn = document.getElementById("nextBtn");

    if (currentLine >= dialogueScript.length) {
        nextBtn.style.display = "none";
        document.getElementById("dialogueBox").classList.remove("active");
        return;
    }
    
    const line = dialogueScript[currentLine];

    if (line.character) {
        nameLabel.textContent = line.character.name;
    } else {
        nameLabel.textContent = "";
    }
    textBox.textContent = line.text;

    const heroPortrait = document.getElementById("heroPortrait");
    const villainPortrait = document.getElementById("villainPortrait");
    const girlfriendPortrait = document.getElementById("girlfriendPortrait");

    heroPortrait.src = characters.hero.portrait;
    villainPortrait.src = characters.villain.portrait;
    girlfriendPortrait.src = characters.girlfriend.portrait;

    if (currentLine === 6) {
        heroPortrait.className = "portrait-img inactive-portrait";
        villainPortrait.className = "portrait-img active-portrait escape-right";
        girlfriendPortrait.className = "portrait-img inactive-portrait escape-right";

    } else if (currentLine === 7) { 
        villainPortrait.className = "portrait-img escape-right";
        girlfriendPortrait.className = "portrait-img escape-right";
        heroPortrait.className = "portrait-img active-portrait";
        
    } else if (line.portraitId === "chaseAction") {
        villainPortrait.className = "portrait-img escape-right";
        girlfriendPortrait.className = "portrait-img escape-right";
        heroPortrait.className = "portrait-img active-portrait chase-out-right";
        
    } else if (currentLine === 9) {
        heroPortrait.className = "portrait-img inactive-portrait";
        villainPortrait.className = "portrait-img active-portrait";
        girlfriendPortrait.className = "portrait-img inactive-portrait";
        
    } else if (line.portraitId === "villainVanished") {
        villainPortrait.className = "portrait-img villain-vanished-instantly";
        heroPortrait.className = "portrait-img inactive-portrait";
        girlfriendPortrait.className = "portrait-img inactive-portrait";
        
    } else if (line.portraitId === "heroMeet" || currentLine === 12) {
        if (currentLine === 12) {
            nextBtn.style.display = "none";
        }
        villainPortrait.className = "portrait-img villain-vanished-instantly";
        girlfriendPortrait.className = "portrait-img girlfriend-rescued-center";
        heroPortrait.className = "portrait-img hero-meet-center";
        
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
