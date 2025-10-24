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

const leaves = [];
let score = 0;
let gameOver = false;

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

function createLeaf() {
  const size = 40 + Math.random() * 20;
  const x = Math.random() * (canvas.width -size)
  const y = - size;
  const speed = 2 + Math.random() * 2;

  const types = ["green", "red", "black"]
  const type = types[Math.floor(Math.random() * types.length)]

  let image = new Image();
  if (type === "green") {
    image.src = "images/greenLeaf.png";
  } else if (type === "red"){
    image.src = "images/redLeaf.png";
  } else if (type === "black") {
    image.src = "images/blackLeaf.png"
  }

  leaves.push({ x, y, size, speed, type, image})
}

function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height)
}

function drawLeaves() {
  for (let i = 0; i < leaves.length; i++) {
    const leaf = leaves[i];
    ctx.drawImage(leaf.image, leaf.x, leaf.y, leaf.size, leaf.size)
  }
}

function updateLeaves() {
    for (let i = leaves.length - 1; i >= 0; i--) {
        const leaf = leaves[i];
        leaf.y += leaf.speed;

        if (isLeafCaught(leaf)) {
          if (leaf.type === "green") {
            score += 1;
          } else if (leaf.type === "red") {
            score -= 1;
          } else if (leaf.type === "black") {
            gameOver = true;
          }
        leaves.splice(i, 1);
        continue;
        }

        if (leaf.y > canvas.height) {
        leaves.splice(i, 1);
        }
    }

    if (Math.random() < 0.03) {
        createLeaf();
    }
}

function isLeafCaught(leaf) {
  const playerTop = player.y
  const playerBottom = player.y + player.height
  const playerLeft = player.x
  const playerRight = player.x + player.width;

  const leafBottom = leaf.y + leaf.size
  const leafLeft = leaf.x;
  const leafRight = leaf.x + leaf.size

  const horizontallyAligned = leafRight > playerLeft + 20 && leafLeft < playerRight - 20;
  const verticallyAligned = leafBottom > playerTop + 10 && leafBottom < playerTop + 40

  return horizontallyAligned && verticallyAligned;
}

function drawScore() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "#8B4513";
  ctx.fillText("Score: " + score, 20, 40)
}

function drawGameOver() {
  ctx.font = "48px Arial"
  ctx.fillStyle = "red"
  ctx.textAlign = "center"
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2)
}

function game() {
    if (gameOver) {
      drawGameOver();
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateLeaves();
    drawLeaves();
    playerMovement();
    drawPlayer();
    drawScore();
    requestAnimationFrame(game);
}

const leafImage = new Image();
leafImage.src = "images/greenLeaf.png";

game();