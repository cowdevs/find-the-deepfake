function getRandomIndex() {
    return Math.floor(Math.random() * 1000);
}

let aiImageIndex;
const imageIds = ['image1', 'image2', 'image3'];

// function cropImage(url, callback) {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.src = url;
//     img.onload = function() {
//         const canvas = document.createElement('canvas');
//         canvas.width = 512;
//         canvas.height = 512;
//         const ctx = canvas.getContext('2d');
//         ctx.drawImage(img, 0, 0, 1004, 1004, 0, 0, 512, 512);
//         const croppedImageUrl = canvas.toDataURL("image/jpg");
//         callback(croppedImageUrl);
//     };
// }

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
            // cropImage('https://thispersondoesnotexist.com', function(croppedImageUrl) {});
            document.getElementById(imageId).src = 'https://thispersondoesnotexist.com';
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
        } else {
            const img = new Image();
            img.src = `real_images/person${getRandomIndex()}.jpg`;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 512;
                canvas.height = 512;
                ctx.drawImage(img, 0, 0);
                ctx.font = "9px Arial";
                ctx.fillStyle = "black";
                ctx.fillText("StyleGAN2 (Karras et al.)", 410, 508);
                document.getElementById(imageId).src = canvas.toDataURL("image/jpg");
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