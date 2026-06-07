const characters = {
    hero: { name: "Nyan Cat", portrait: "assets/images/nyancat-1.png" },
    villain: { name: "Dark Choco Cat", portrait: "assets/images/nyancat-2.png" },
    girlfriend: { name: "Cream Cat", portrait: "assets/images/nyancat-3.png" }
};

// key 0 = 게임 시작 인트로, key 1~4 = 스테이지 클리어 후 다음 스테이지 진입 전, key 5 = 엔딩
const dialogueScripts = {
    0: [
        { character: characters.villain,    text: "크하하! 드디어 Cream Cat를 손에 넣었다!", portraitId: "villainPortrait" },
        { character: characters.girlfriend, text: "놔줘! Nyan Cat이 반드시 날 구하러 올 거야!", portraitId: "girlfriendPortrait" },
        { character: characters.villain,    text: "어림없지. 우주 끝까지 도망쳐도 못 찾을 테다!", portraitId: "villainPortrait" },
        { character: characters.hero,       text: "Dark Choco Cat! 당장 Cream Cat를 돌려줘!", portraitId: "heroPortrait" },
        { character: characters.villain,    text: "왔군, Nyan Cat. 어디 잡을 수 있다면 잡아봐!", portraitId: "villainPortrait" },
        { character: characters.girlfriend, text: "Nyan Cat...! 오지마! 이건 위험한 함정이야..!", portraitId: "girlfriendPortrait" },
        { character: characters.hero,       text: "걱정 마! 반드시 구하러 갈게!", portraitId: "heroPortrait" },
    ],
    1: [
        { character: characters.villain,    text: "크... 이 구역은 통과했군. 하지만 아직 멀었다!", portraitId: "villainPortrait" },
        { character: characters.hero,       text: "Dark Choco Cat! 거기 서!", portraitId: "heroPortrait" },
        { character: characters.villain,    text: "쫓아올 수 있다면 와봐. 다음 구역은 더 혹독할 거다!", portraitId: "villainPortrait" },
        { character: characters.girlfriend, text: "Nyan Cat... 저기가 더 위험해. 제발 조심해...", portraitId: "girlfriendPortrait" },
        { character: characters.hero,       text: "걱정 마, Cream Cat. 반드시 구하러 갈게!", portraitId: "heroPortrait" },
        { character: characters.villain,    text: "크하하! 감동적이군. 어디 따라와 봐!", portraitId: "villainPortrait" },
    ],
    2: [
        { character: characters.villain,    text: "또 여기까지 왔군... 생각보다 질기네.", portraitId: "villainPortrait" },
        { character: characters.hero,       text: "이제 끝이야, Dark Choco Cat! 더 도망칠 곳 없어!", portraitId: "heroPortrait" },
        { character: characters.girlfriend, text: "Nyan Cat! 나 여기 있어! 조금만 더...!", portraitId: "girlfriendPortrait" },
        { character: characters.villain,    text: "흥, 아직 멀었다고. 포기해라!", portraitId: "villainPortrait" },
        { character: characters.hero,       text: "절대 포기 안 해. 지금 가고 있어, Cream Cat!", portraitId: "heroPortrait" },
        { character: characters.villain,    text: "두고 봐라... 더 깊은 곳으로 끌고 가주지!", portraitId: "villainPortrait" },
    ],
    3: [
        { character: characters.villain,    text: "크... 여기까지 쫓아오다니. 보통 놈이 아니군.", portraitId: "villainPortrait" },
        { character: characters.hero,       text: "이제 진짜 끝이야. Cream Cat, 거의 다 왔어!", portraitId: "heroPortrait" },
        { character: characters.girlfriend, text: "Nyan Cat!! 한 구역만 더야! 포기하지 마!!", portraitId: "girlfriendPortrait" },
        { character: characters.villain,    text: "마지막 구역에서 끝장을 봐주지. 각오해라!", portraitId: "villainPortrait" },
        { character: characters.hero,       text: "덤벼! 이번엔 절대 놓치지 않을 거야!", portraitId: "heroPortrait" },
    ],
    4: [
        { character: characters.villain,    text: "...놀랍군. 여기까지 올 줄은 정말 몰랐어.", portraitId: "villainPortrait" },
        { character: characters.hero,       text: "끝이야, Dark Choco Cat. 이제 더 도망칠 곳 없어!", portraitId: "heroPortrait" },
        { character: characters.girlfriend, text: "Nyan Cat!! 드디어...! 마지막이야, 힘내!!!", portraitId: "girlfriendPortrait" },
        { character: characters.villain,    text: "크... 어디 마지막 힘을 보여주지! 절대 포기 안 해!", portraitId: "villainPortrait" },
        { character: characters.hero,       text: "Cream Cat, 지금 간다!!!", portraitId: "heroPortrait" },
    ],
    5: [
        { character: characters.villain,    text: "하하... 드디어 여기까지 왔군. 하지만 이미 늦었다.", portraitId: "villainPortrait" },
        { character: characters.hero,       text: "Dark Choco Cat! Cream Cat는 어디 있지? 당장 그녀를 돌려줘!", portraitId: "heroPortrait" },
        { character: characters.villain,    text: "돌려달라고? 어림도 없지. 나는 그녀를 내 시종으로 부릴것이다.", portraitId: "villainPortrait" },
        { character: characters.hero,       text: "그만둬! Cream Cat를 이용하게 두지 않겠어!", portraitId: "heroPortrait" },
        { character: characters.girlfriend, text: "Nyan Cat...! 오지마! 이건 위험한 함정이야..!", portraitId: "girlfriendPortrait" },
        { character: characters.hero,       text: "여친! 기다려, 내가 지금 구하러 갈게!", portraitId: "heroPortrait" },
        { character: characters.villain,    text: "크하하! 정말 눈물겹군. 그럼 어디 실력 발휘 좀 해보시지!", portraitId: "villainPortrait", animation: "escapeRight" },
        { character: characters.hero,       text: "거기서!!!", portraitId: "heroPortrait", animation: "heroShout" },
        { character: null,                  text: "", portraitId: null, animation: "heroChase" },
        { character: characters.villain,    text: "크윽 내가 따라잡히다니", portraitId: "villainPortrait", animation: "villainCaught" },
        { character: null,                  text: "", portraitId: null, animation: "villainVanished" },
        { character: null,                  text: "", portraitId: null, animation: "heroMeet" },
    ],
};

const currentLevel = parseInt(localStorage.getItem('charaLevel')) || 0;
const script = dialogueScripts[currentLevel] || dialogueScripts[0];
let currentLine = 0;

const updateDialogue = () => {
    const nameLabel = document.getElementById("charName");
    const textBox = document.getElementById("dialogueText");
    const nextBtn = document.getElementById("nextBtn");

    const heroPortrait = document.getElementById("heroPortrait");
    const villainPortrait = document.getElementById("villainPortrait");
    const girlfriendPortrait = document.getElementById("girlfriendPortrait");

    heroPortrait.src = characters.hero.portrait;
    villainPortrait.src = characters.villain.portrait;
    girlfriendPortrait.src = characters.girlfriend.portrait;

    if (currentLine >= script.length) {
        nextBtn.style.display = "none";
        document.getElementById("dialogueBox").classList.remove("active");
        setTimeout(() => {
            window.location.replace('game.html');
        }, 1500);
        return;
    }

    const line = script[currentLine];
    nameLabel.textContent = line.character ? line.character.name : "";
    textBox.textContent = line.text;

    const anim = line.animation;

    if (anim === "escapeRight") {
        heroPortrait.className = "portrait-img inactive-portrait";
        villainPortrait.className = "portrait-img active-portrait escape-right";
        girlfriendPortrait.className = "portrait-img inactive-portrait escape-right";
    } else if (anim === "heroShout") {
        villainPortrait.className = "portrait-img escape-right";
        girlfriendPortrait.className = "portrait-img escape-right";
        heroPortrait.className = "portrait-img active-portrait";
    } else if (anim === "heroChase") {
        villainPortrait.className = "portrait-img escape-right";
        girlfriendPortrait.className = "portrait-img escape-right";
        heroPortrait.className = "portrait-img active-portrait chase-out-right";
    } else if (anim === "villainCaught") {
        heroPortrait.className = "portrait-img inactive-portrait";
        villainPortrait.className = "portrait-img active-portrait";
        girlfriendPortrait.className = "portrait-img inactive-portrait";
    } else if (anim === "villainVanished") {
        villainPortrait.className = "portrait-img villain-vanished-instantly";
        heroPortrait.className = "portrait-img inactive-portrait";
        girlfriendPortrait.className = "portrait-img inactive-portrait";
    } else if (anim === "heroMeet") {
        villainPortrait.className = "portrait-img villain-vanished-instantly";
        girlfriendPortrait.className = "portrait-img girlfriend-rescued-center";
        heroPortrait.className = "portrait-img hero-meet-center";
        nextBtn.style.display = "none";
        setTimeout(() => {
            window.location.replace('main.html');
        }, 2000);
    } else {
        heroPortrait.className = "portrait-img inactive-portrait";
        villainPortrait.className = "portrait-img inactive-portrait";
        girlfriendPortrait.className = "portrait-img inactive-portrait";
        const activePortrait = document.getElementById(line.portraitId);
        if (activePortrait) {
            activePortrait.className = "portrait-img active-portrait";
        }
    }

    currentLine++;
};

const startScene = () => {
    document.getElementById("dialogueBox").classList.add("active");
    updateDialogue();
};

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
