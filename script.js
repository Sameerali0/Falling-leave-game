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
}

player.image.src = "images/player.png";

function drawPlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height)
}

function game() {
    drawPlayer();
    requestAnimationFrame(game);
}

game();