function getRandomImage() {
    const randomFolder = ("00" + Math.floor(Math.random() * 70)).slice(-2) + "000"
    const randomFile = randomFolder.slice(0,2) + ('000'+Math.floor(Math.random() * 1000)).slice(-3)
    return `https://raw.githubusercontent.com/cowdevs/ffhq-dataset-512/main/images512x512/${randomFolder}/${randomFile}.png`
}

function startGame() {
    document.getElementById("titleButton").hidden = true;
    document.getElementById("titleLabel").style.top = "5vh";
    document.getElementById("roundLabel").hidden = false;
    document.getElementById("infoButton").hidden = false;
    nextRound()
}

function revealImages() {
    const timeouts = [];
    for (let i = 0; i < 3; i++) {
        const imageId = "image" + (i + 1);
        const timeout = new Promise(resolve => {
            setTimeout(() => {
                document.getElementById(imageId).parentElement.hidden = false;
                resolve();
            }, i * 500);
        });
        timeouts.push(timeout);
    }

    Promise.all(timeouts).then(() => {
        for (let i = 0; i < 3; i++) {
            const imageId = "image" + (i + 1);
            document.getElementById(imageId).parentElement.style.pointerEvents = "auto";
        }
    });
}

function loadImage(imageId, src, callback) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = function() {
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

const numRounds = 5;
let aiImageIndex;
let currentRound = 0;
let numCorrect = 0;

function nextRound() {
    currentRound += 1;
    document.getElementById("roundLabel").innerText = currentRound + "/" + numRounds;
    document.getElementById("nextButton").hidden = true;

    aiImageIndex = Math.floor(Math.random() * 3);
    let imagesLoaded = 0;
    for (let i = 0; i < 3; i++) {
        const imageId = "image" + (i + 1);
        const imageElement = document.getElementById(imageId);
        const imageButton = imageElement.parentElement;
        imageElement.style.border = "8px solid #1e1e1e";
        imageButton.style.transform = "";
        imageButton.hidden = true;
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

function selectImage(selectedImageID) {
    if (selectedImageID === "image" + (aiImageIndex + 1)) {
        numCorrect++;
    }

    for (let i = 0; i < 3; i++) {
        const imageId = "image" + (i + 1);
        if (imageId !== selectedImageID) {
            document.getElementById(imageId).parentElement.style.transform = "";
            document.getElementById(imageId).parentElement.style.pointerEvents = "none";
        }
        setTimeout(() => {
            if (i === aiImageIndex) {
                document.getElementById(imageId).style.border = "8px solid #04AA6D";
            } else {
                document.getElementById(imageId).style.border = "8px solid crimson";
            }
        }, i * 500);
    }

    document.getElementById(selectedImageID).parentElement.style.transform = "scale(1.1)";

    if (currentRound === numRounds) {
        document.getElementById("finishButton").hidden = false;
    } else {
        document.getElementById("nextButton").hidden = false;
    }
}

function openPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
    setTimeout(() => {
        popup.classList.add('show');
    }, 20);
}

function closePopup() {
    const popup = document.getElementById('popup');
    popup.classList.remove('show');
    popup.addEventListener('transitionend', function handler() {
        popup.style.display = 'none';
        popup.removeEventListener('transitionend', handler);
    });
}

function endGame() {
    const ranks = ["Failure", "Newbie", "Amateur", "Scholar", "Expert", "Master"];
    const score = numCorrect + "/" + numRounds;
    const rank = ranks[Math.min(5, Math.floor(numCorrect / numRounds * 6))];

    localStorage.setItem('score', score);
    localStorage.setItem('rank', rank);

    window.location.href = "end.html";
}