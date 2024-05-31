function getRandomIndex() {
    return Math.floor(Math.random() * 1000);
}

let aiImageIndex;
const imageIds = ['image1', 'image2', 'image3'];

function cropImage(url, callback) {
    const img = new Image();
    img.crossOrigin = "anonymous";  // This enables CORS
    img.src = 'http://localhost:3000/proxy?url=' + encodeURIComponent(url);
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 1004, 1004, 0, 0, 512, 512);
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
    let imagesLoaded = 0;
    for (let i = 0; i < 3; i++) {
        const imageId = "image" + (i + 1);
        document.getElementById(imageId).parentElement.hidden = true;
        if (i === aiImageIndex) {
            cropImage('https://thispersondoesnotexist.com', function(croppedImageUrl) {
                document.getElementById(imageId).src = croppedImageUrl;
                document.getElementById(imageId).onload = function() {
                    imagesLoaded++;
                    if (imagesLoaded === 3) {
                        imageIds.forEach((imageId, index) => {
                            setTimeout(() => {
                                document.getElementById(imageId).parentElement.hidden = false;
                            }, index * 500);
                        });
                    }
                };
            });
        } else {
            const img = new Image();
            img.src = `real_images/person${getRandomIndex()}.jpg`;
            img.onload = function() {
                document.getElementById(imageId).src = this.src;
                imagesLoaded++;
                if (imagesLoaded === 3) {
                    imageIds.forEach((imageId, index) => {
                        setTimeout(() => {
                            document.getElementById(imageId).parentElement.hidden = false;
                        }, index * 500);
                    });
                }
            };
        }
        document.getElementById(imageId).style.border = "8px solid #1e1e1e";
    }
}

function selectImage(imageId) {
    const selectedImage = document.getElementById('image' + imageId);

    imageIds.forEach((imageId) => {
        document.getElementById(imageId).parentElement.style.transform = "";
    });

    if (Number(imageId) - 1 === aiImageIndex) {
        selectedImage.style.border = "8px solid #04AA6D";
    } else {
        selectedImage.style.border = "8px solid crimson";
    }

    document.getElementById("nextButton").hidden = false;
}