function getRandomIndex() {
    return Math.floor(Math.random() * 1000);
}

let aiImageIndex;
const imageIds = ['image1', 'image2', 'image3'];

function startGame() {
    document.getElementById("titleButton").hidden = true;
    document.getElementById("titleLabel").style.top = "15%";
    nextRound()
}

function nextRound() {
    document.getElementById("nextButton").hidden = true;

    imageIds.forEach((imageId) => {
        document.getElementById(imageId).parentElement.hidden = true;
    });

    aiImageIndex = Math.floor(Math.random() * 3);
    const directories = ["real_images", "real_images", "real_images"];
    directories[aiImageIndex] = "ai_images";
    
    imageIds.forEach((imageId, index) => {
        document.getElementById(imageId).src = `${directories[index]}/person_${getRandomIndex()}.png`;
        document.getElementById(imageId).style.border = "8px solid #1e1e1e";
    });

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