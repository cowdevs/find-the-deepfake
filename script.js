function getRandomIndex() {
    return Math.floor(Math.random() * 1000);
}

let aiImageIndex;
const imageIds = ['image1', 'image2', 'image3'];

function cropImage(url, callback) {
    const img = new Image(1024, 1024);
    img.crossOrigin = "anonymous";  // This enables CORS
    img.src = url;
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = 1004;
        canvas.height = 1004;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 1004, 1004, 0, 0, 1004, 1004);
        const croppedImageUrl = canvas.toDataURL("image/png");
        callback(croppedImageUrl);
    };
}

function startGame() {
    document.getElementById("titleButton").hidden = true;
    document.getElementById("titleLabel").style.top = "15%";
    nextRound()
}

function nextRound() {
    document.getElementById("nextButton").hidden = true;

    aiImageIndex = Math.floor(Math.random() * 3);
    for (let i = 0; i < 3; i++) {
        const imageId = "image" + (i + 1);
        document.getElementById(imageId).parentElement.hidden = true;
        if (i === aiImageIndex) {
            cropImage('https://thispersondoesnotexist.com', function(croppedImageUrl) {
                document.getElementById(imageId).src = croppedImageUrl;
            });
        } else {
            document.getElementById(imageId).src = `real_images/person_${getRandomIndex()}.png`;
        }
        document.getElementById(imageId).style.border = "8px solid #1e1e1e";
    }

    imageIds.forEach((imageId, index) => {
        setTimeout(() => {
            document.getElementById(imageId).parentElement.hidden = false;
        }, index * 500);
    });
}

function isDeepfake(imageId) {
    return Number(imageId) - 1 === aiImageIndex;
}

function selectImage(imageId) {
    const selectedImage = document.getElementById('image' + imageId);

    imageIds.forEach((imageId) => {
        document.getElementById(imageId).parentElement.style.transform = "";
    });

    if (isDeepfake(imageId)) {
        selectedImage.style.border = "8px solid #04AA6D";
    } else {
        selectedImage.style.border = "8px solid crimson";
    }

    document.getElementById("nextButton").hidden = false;
}