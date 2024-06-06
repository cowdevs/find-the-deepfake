let numLives;
let difficulty;
let numCorrect = 0;

class Difficulty {
    constructor(name, value, lives, time) {
        this.name = name;
        this.value = value;
        this.lives = lives;
        this.time = time;
    }
}

const difficulties = [
    new Difficulty("Zen", -2, null, null),
    new Difficulty("Easy", -1, 5, null),
    new Difficulty("Normal", 0, 3, null),
    new Difficulty("Hard", 1, 3, 3),
    new Difficulty("Sudden Death", 2, 1, 3),
];

function getDifficultyByValue(value) {
    for (let i = 0; i < difficulties.length; i++) {
        if (value.toString() === difficulties[i].value.toString()) {
            return difficulties[i];
        }
    }
}

function loadHearts() {
    if (numLives) {
        for (let i = 0; i < numLives; i++) {
            const heart = document.createElement("i");
            heart.classList.add("material-symbols-outlined", "heart");
            heart.id = "heart" + (i + 1);
            heart.style.fontSize = "2vw";
            heart.innerText = "favorite";
            document.getElementById("heartsContainer").appendChild(heart);
        }
    } else {
        const heart = document.createElement("i");
        heart.classList.add("material-symbols-outlined", "heart");
        heart.style.fontSize = "2vw";
        heart.innerText = "favorite";

        const infinitySymbol = document.createElement("i");
        infinitySymbol.classList.add("material-symbols-outlined", "infinity");
        infinitySymbol.style.fontSize = "1.5vw";
        infinitySymbol.innerText = "all_inclusive";
        
        document.getElementById("heartsContainer").appendChild(heart);
        document.getElementById("heartsContainer").appendChild(infinitySymbol);
    }
}

function loadDifficulties() {
    for (let i = 0; i < difficulties.length; i++) {
        const difficulty = difficulties[i];
        const difficultyOption = document.createElement("option");
        difficultyOption.innerText = difficulty.name;
        difficultyOption.value = difficulty.value.toString();
        document.getElementById("difficultyMenu").appendChild(difficultyOption);
    }
}

function startGame() {
    loadDifficulties();
    getStoredDifficulty();
    setRules();
    loadHearts();
    nextRound();
}

function setRules() {
    numLives = difficulty.lives;
    countdownSeconds = difficulty.time;
    console.log("Difficulty: " + difficulty.name);
    console.log("Lives: " + difficulty.lives);
    console.log("Timer: " + difficulty.time)
}

function storeDifficulty() {
    const difficultyMenu = document.getElementById("difficultyMenu");
    localStorage.setItem('difficulty', difficultyMenu.value);
}

function getStoredDifficulty() {
    const storedDifficulty = localStorage.getItem('difficulty');
    const difficultyMenu = document.getElementById("difficultyMenu");

    if (storedDifficulty) {
        difficultyMenu.value = storedDifficulty;
    } else {
        difficultyMenu.value = "0";
        localStorage.setItem('difficulty', "0");
    }

    difficulty = getDifficultyByValue(storedDifficulty);
}

let aiImageIndex;

function getRandomImage() {
    const randomFolder = ("00" + Math.floor(Math.random() * 70)).slice(-2) + "000";
    const randomFile = randomFolder.slice(0,2) + ('000'+Math.floor(Math.random() * 1000)).slice(-3);
    return `https://raw.githubusercontent.com/cowdevs/ffhq-dataset-512/main/images512x512/${randomFolder}/${randomFile}.png`;
}

function displayImages() {
    const timeouts = [];
    for (let i = 0; i < 3; i++) {
        const imageId = "image" + (i + 1);
        const timeout = new Promise(resolve => {
            setTimeout(() => {
                document.getElementById(imageId).classList.add('revealed');
                document.getElementById(imageId).style.visibility = "visible";
                resolve();
            }, i * 500);
        });
        timeouts.push(timeout);
    }

    Promise.all(timeouts).then(() => {
        for (let i = 0; i < 3; i++) {
            const imageId = "image" + (i + 1);
            document.getElementById(imageId).style.pointerEvents = "auto";
        }
        if (countdownSeconds) {
            startCountdown();
        }
    });
}

let progressInterval;

function startCountdown() {
    const countdownBar = document.getElementById("countdownBar");
    countdownBar.max = (countdownSeconds) * 1000;
    countdownBar.hidden = false;
    countdownBar.value = 0;

    progressInterval = setInterval(function() {
        if (countdownBar.value < countdownBar.max) {
            countdownBar.value += 5;
        } else {
            clearInterval(progressInterval);
            countdownTimeout();
        }
    }, 5);
}

function revealDeepfake() {
    for (let i = 0; i < 3; i++) {
        const imageId = "image" + (i + 1);
        document.getElementById(imageId).style.pointerEvents = "none";
        if (i === aiImageIndex) {
            document.getElementById(imageId).style.border = "0.4vw solid #04AA6D";
        } else {
            document.getElementById(imageId).style.border = "0.4vw solid crimson";
        }
    }
}

function deductLife() {
    numLives--;
    document.getElementById("heart" + (numLives + 1)).classList.add("lost")
    if (numLives === 0) {
        document.getElementById("nextButton").innerText = "Finish";
        document.getElementById("nextButton").onclick = endGame;
    }    
}

function countdownTimeout() {
    revealDeepfake()
    
    document.getElementById("countdownBar").hidden = true;

    if (numLives) {
        deductLife();
    }
    
    document.getElementById("nextButton").hidden = false;
}

function selectImage(selectedImageID) {
    revealDeepfake()
    document.getElementById(selectedImageID).style.transform = "scale(1.1)";
    
    clearInterval(progressInterval);
    document.getElementById("countdownBar").hidden = true;

    if (selectedImageID === "image" + (aiImageIndex + 1)) {
        numCorrect++;
    } else {
        if (numLives) {
            deductLife();
        }    
    }
    
    document.getElementById("nextButton").hidden = false;
}

function loadImage(imageId, src, callback) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = function() {
        // Fake watermark hehe :)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        ctx.drawImage(img, 0, 0);
        ctx.font = "9px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("StyleGAN2 (Karras et al.)", 410, 508);
        document.getElementById(imageId).src = canvas.toDataURL("image/png");
        callback();
    };
}

function nextRound() {
    document.getElementById("nextButton").hidden = true;

    aiImageIndex = Math.floor(Math.random() * 3);
    let imagesLoaded = 0;
    for (let i = 0; i < 3; i++) {
        const imageId = "image" + (i + 1);
        const imageElement = document.getElementById(imageId);
        const imageButton = imageElement;
        imageElement.style.border = "0.4vw solid #1e1e1e";
        imageButton.style.transform = "";
        imageButton.classList.remove('revealed');
        imageButton.style.visibility = "hidden";
        imageButton.style.pointerEvents = "none";

        if (i === aiImageIndex) {
            imageElement.src = 'https://thispersondoesnotexist.com';
            imageElement.onload = function() {
                imagesLoaded++;
                if (imagesLoaded === 3) {
                    displayImages();
                }
            };
        } else {
            loadImage(imageId, getRandomImage(), () => {
                imagesLoaded++;
                if (imagesLoaded === 3) {
                    displayImages();
                }
            });
        }
    }
}



let initialDifficulty;

function openPopup(popupID) {
    const popup = document.getElementById(popupID);
    if (popupID === 'settingsPopup') {
        const selectElement = document.getElementById("difficultyMenu");
        initialDifficulty = selectElement.value;
    }
    popup.style.display = 'flex';
    setTimeout(() => {
        popup.classList.add('show');
    }, 20);
}

function closePopup(popupID) {
    const popup = document.getElementById(popupID);
    if (popupID === 'settingsPopup') {
        const selectElement = document.getElementById("difficultyMenu");
        selectElement.value = initialDifficulty;
    }
    popup.classList.remove('show');
    popup.addEventListener('transitionend', function handler() {
        popup.style.display = 'none';
        popup.removeEventListener('transitionend', handler);
    });
}

function startNewGame() {
    storeDifficulty()
    window.location.href = "game.html";
}

function rankFormula(score, numRanks) {
    return Math.floor(-numRanks * Math.pow(0.9, score) + numRanks)
}

function endGame() {
    const ranks = ["Newbie", "Amateur", "Expert", "Master"];
    const numRanks = ranks.length;
    
    const multiplier = (difficulty.value + numRanks) / numRanks;
    
    localStorage.setItem('score', numCorrect);
    localStorage.setItem('rank', ranks[rankFormula(multiplier * numCorrect, numRanks)]);
    window.location.href = "end.html";
}