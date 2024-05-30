function getRandomIndex() {
    return Math.floor(Math.random() * 1000);
}

let aiImageIndex;

function startGame() {
    document.getElementById("titleButton").style.display = "none";
    document.getElementById("titleLabel").style.top = "15%";
    nextRound()
}

function nextRound() {
    ['image1', 'image2', 'image3'].forEach((imageId) => {
        document.getElementById(imageId).src = "none";
        document.getElementById(imageId).style.border = "none";
    });

    aiImageIndex = Math.floor(Math.random() * 3);
    const directories = ["real_images", "real_images", "real_images"];
    directories[aiImageIndex] = "ai_images";

    ['image1', 'image2', 'image3'].forEach((imageId, index) => {
        setTimeout(() => {
            document.getElementById(imageId).src = `${directories[index]}/person_${getRandomIndex()}.png`;
            document.getElementById(imageId).style.border = "8px solid #1e1e1e";
        }, index * 333);
    });
}

function isDeepfake(imageId) {
    return Number(imageId) - 1 === aiImageIndex;
}

function selectImage(imageId) {
    const selectedImage = document.getElementById('image' + imageId);

    ['image1', 'image2', 'image3'].forEach((imageId) => {
        document.getElementById(imageId).parentElement.style.transform = "none";
    });

    if (isDeepfake(imageId)) {
        selectedImage.style.border = "8px solid green";
    } else {
        selectedImage.style.border = "8px solid red";
    }
}