function getRandomIndex() {
    return Math.floor(Math.random() * 1000);
}


function startGame() {
    document.getElementById("titleButton").hidden = true;
    document.getElementById("titleLabel").style.top = "15%";
    document.getElementById("roundLabel").hidden = false;
    nextRound()
}

function revealImages() {
    for (let i = 0; i < 3; i++) {
        const imageId = "image" + (i + 1);
        setTimeout(() => {
            document.getElementById(imageId).parentElement.hidden = false;
        }, i * 500);
    }
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

let aiImageIndex;
let currentRound = 0;
const numRounds = 10;

function nextRound() {
    if (currentRound === numRounds) {
        return;
    }

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
        imageButton.style.pointerEvents = "auto";

        if (i === aiImageIndex) {
            imageElement.src = 'https://thispersondoesnotexist.com';
            imageElement.onload = function() {
                imagesLoaded++;
                if (imagesLoaded === 3) {
                    revealImages();
                }
            };
        } else {
            loadImage(imageId, `https://raw.githubusercontent.com/cowdevs/find-the-deepfake-data/main/real_images/person${getRandomIndex()}.png`, () => {
                imagesLoaded++;
                if (imagesLoaded === 3) {
                    revealImages();
                }
            });
        }
    }

    if (currentRound === numRounds - 1) {
        document.getElementById("nextButton").firstElementChild.innerText = 'Finish';
    }
}

function selectImage(selectedImageID) {
    for (let i = 0; i < 3; i++) {
        const imageId = "image" + (i + 1);
        if (imageId !== selectedImageID) {
            document.getElementById(imageId).parentElement.style.transform = "";
            document.getElementById(imageId).parentElement.style.pointerEvents = "none";
        }
        if (i === aiImageIndex) {
            document.getElementById(imageId).style.border = "8px solid #04AA6D";
        } else {
            document.getElementById(imageId).style.border = "8px solid crimson";
        }
    }

    document.getElementById(selectedImageID).parentElement.style.transform = "scale(1.1)";
    document.getElementById("nextButton").hidden = false;
}