const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 560;

const player = {
    x: canvas.width / 2 - 75,
    y: canvas.height - 140,
    width: 150,
    height: 150,
    image: new Image(),
    speed: 5,
}

player.image.src = "images/player.png";

function drawPlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height)
}

function game() {
    playerMovement();
    drawPlayer();
    requestAnimationFrame(game);
}

const keys = {
    left: false,
    right: false,
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") keys.left = true;
    if (event.key === "ArrowRight") keys.right = true;
})

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") keys.left = false;
    if (event.key === "ArrowRight") keys.right = false;
})

function playerMovement() {
    if (keys.left && player.x > 0) {
        player.x -= player.speed;
    }

    if (keys.right && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }
}

game();