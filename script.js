let numLives;
let countdownSeconds;
let numCorrect = 0;

function loadHearts() {
    for (let i = 0; i < numLives; i++) {
        const heart = document.createElement("i");
        heart.classList.add("material-symbols-outlined", "heart");
        heart.id = "heart" + (i + 1);
        heart.style.fontSize = "2vw";
        heart.innerText = "favorite";
        document.getElementById("heartsContainer").appendChild(heart);
    }
}

function startGame() {
    const difficulty = getStoredDifficulty();
    setRules(difficulty)
    loadHearts();
    // loadTimer();
    nextRound();
}

function setRules(difficulty) {
    if (difficulty === "easy") {
        numLives = 5;
        countdownSeconds = 0;
    } else if (difficulty === "medium") {
        numLives = 3;
        countdownSeconds = 0;
    } else if (difficulty === "hard") {
        numLives = 3;
        countdownSeconds = 3;
    } else {
        numLives = 1;
        countdownSeconds = 3;
    }
    console.log("Difficulty: " + difficulty);
    console.log("Lives: " + numLives);
}

function storeDifficulty() {
    const selectElement = document.getElementById("difficulties");
    localStorage.setItem('difficulty', selectElement.value);
}

function getStoredDifficulty() {
    const storedDifficulty = localStorage.getItem('difficulty');
    const selectElement = document.getElementById("difficulties");

    if (storedDifficulty) {
        selectElement.value = storedDifficulty;
    } else {
        selectElement.value = "medium";
    }

    return storedDifficulty;
}

let aiImageIndex;

function getRandomImage() {
    const randomFolder = ("00" + Math.floor(Math.random() * 70)).slice(-2) + "000";
    const randomFile = randomFolder.slice(0,2) + ('000'+Math.floor(Math.random() * 1000)).slice(-3);
    return `https://raw.githubusercontent.com/cowdevs/ffhq-dataset-512/main/images512x512/${randomFolder}/${randomFile}.png`;
}

function revealImages() {
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
        if (countdownSeconds > 0) {
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

function countdownTimeout() {
    document.getElementById("countdownBar").hidden = true;

    numLives--;
    document.getElementById("heart" + (numLives + 1)).classList.add("lost")

    for (let i = 0; i < 3; i++) {
        const imageId = "image" + (i + 1);
        if (i === aiImageIndex) {
            document.getElementById(imageId).style.border = "0.4vw solid #04AA6D";
        } else {
            document.getElementById(imageId).style.border = "0.4vw solid crimson";
        }
    }

    if (numLives === 0) {
        document.getElementById("nextButton").innerText = "Finish";
        document.getElementById("nextButton").onclick = endGame;
    }
    document.getElementById("nextButton").hidden = false;
}

function selectImage(selectedImageID) {
    clearInterval(progressInterval);
    document.getElementById("countdownBar").hidden = true;

    if (selectedImageID === "image" + (aiImageIndex + 1)) {
        numCorrect++;
    } else {
        numLives--;
        document.getElementById("heart" + (numLives + 1)).classList.add("lost")
    }

    for (let i = 0; i < 3; i++) {
        const imageId = "image" + (i + 1);
        if (imageId !== selectedImageID) {
            document.getElementById(imageId).style.transform = "";
            document.getElementById(imageId).style.pointerEvents = "none";
        }
        if (i === aiImageIndex) {
            document.getElementById(imageId).style.border = "0.4vw solid #04AA6D";
        } else {
            document.getElementById(imageId).style.border = "0.4vw solid crimson";
        }
    }

    document.getElementById(selectedImageID).style.transform = "scale(1.1)";

    if (numLives === 0) {
        document.getElementById("nextButton").innerText = "Finish";
        document.getElementById("nextButton").onclick = endGame;
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
                    revealImages();
                }
            };
        } else {
            loadImage(imageId, getRandomImage(), () => {
                imagesLoaded++;
                if (imagesLoaded === 3) {
                    revealImages();
                }
            });
        }
    }
}



let initialDifficulty;

function openPopup(popupID) {
    const popup = document.getElementById(popupID);
    if (popupID === 'settingsPopup') {
        const selectElement = document.getElementById("difficulties");
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
        const selectElement = document.getElementById("difficulties");
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
    let multiplier;
    const difficulty = localStorage.getItem('difficulty');

    if (difficulty === "easy") {
        multiplier = (numRanks - 1) / numRanks;
    } else if (difficulty === "medium") {
        multiplier = 1;
    } else if (difficulty === "hard") {
        multiplier = (numRanks + 1) / numRanks;
    } else {
        multiplier = (numRanks + 2) / numRanks;
    }

    const score = numCorrect;
    const rank = ranks[rankFormula(multiplier * score, numRanks)];
    localStorage.setItem('score', score);
    localStorage.setItem('rank', rank);
    window.location.href = "end.html";
}