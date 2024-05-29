function getRandomIndex() {
    return Math.floor(Math.random() * 1000); // The maximum is exclusive and the minimum is inclusive
}

function startGame() {
    const titleScreen = document.getElementById("titleScreen");
    const gameScreen = document.getElementById("gameScreen");
    titleScreen.style.display = "none";
    gameScreen.style.display = "block";
    nextRound()
}

function nextRound() {
    const aiImageIndex = Math.floor(Math.random() * 3);
    const directories = ["real_images", "real_images", "real_images"];
    directories[aiImageIndex] = "ai_images";

    ['image1', 'image2', 'image3'].forEach((imageId, index) => {
        document.getElementById(imageId).src = `${directories[index]}/person_${getRandomIndex()}.png`;
    });
}