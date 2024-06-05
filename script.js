let numLives = 3;
let numCorrect = 0;

let aiImageIndex;

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
    nextRound();
    loadHearts();
}

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
    });
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

function selectImage(selectedImageID) {
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
        document.getElementById("finishButton").hidden = false;
    } else {
        document.getElementById("nextButton").hidden = false;
    }
}

function openPopup(popupID) {
    const popup = document.getElementById(popupID);
    popup.style.display = 'flex';
    setTimeout(() => {
        popup.classList.add('show');
    }, 20);
}

function closePopup(popupID) {
    const popup = document.getElementById(popupID);
    popup.classList.remove('show');
    popup.addEventListener('transitionend', function handler() {
        popup.style.display = 'none';
        popup.removeEventListener('transitionend', handler);
    });
}

function endGame() {
    localStorage.setItem('score', numCorrect);
    window.location.href = "end.html";
}