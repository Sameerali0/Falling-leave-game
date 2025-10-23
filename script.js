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
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height)
}

function game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateLeaves();
    drawLeaves();
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

const leaves = [];

const leafImage = new Image();
leafImage.src = "images/greenLeaf.png";

function createLeaf() {
  const size = 40 + Math.random() * 20;
  const x = Math.random() * (canvas.width -size)
  const y = - size;
  const speed = 2 + Math.random() * 2;
  leaves.push({ x, y, size, speed})
}

function drawLeaves() {
  for (let i = 0; i < leaves.length; i++) {
    const leaf = leaves[i];
    ctx.drawImage(leafImage, leaf.x, leaf.y, leaf.size, leaf.size)
  }
}

function updateLeaves() {
    for (let i = 0; i < leaves.length; i++) {
        leaves[i].y += leaves[i].speed;
    }

    for (let i = leaves.length - 1; i >= 0; i --) {
        if (leaves[i].y > canvas.height) {
            leaves.splice(i, 1);
        }
    }

    if (Math.random() < 0.03) {
        createLeaf();
    }
}

game();