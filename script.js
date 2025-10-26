const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("start-screen")
const startBtn = document.getElementById("start-btn")
const gameContainer = document.getElementById("game-container")
const gameOverScreen = document.getElementById("game-over")
const finalScore = document.getElementById("final-score")
const highScoreDisplay = document.getElementById("high-score")
const restartBtn = document.getElementById("restart-btn")

const catchSound = new Audio("sounds/catch.mp3")
const gameOverSound = new Audio("sounds/gameover.mp3")
const bonusSound = new Audio("sounds/bonus.mp3")
const doubleBonusSound = new Audio("sounds/doublebonus.mp3")
const wrongSound = new Audio("sounds/wrong.mp3")
const bgMusic = new Audio("sounds/background.mp3")
bgMusic.loop = true;
bgMusic.volume = 0.5;

const muteBtn = document.getElementById("mute-btn");
let isMuted = false;

muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  bgMusic.muted = isMuted;

  if (isMuted) {
    muteBtn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i> off`
  } else {
    muteBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i> on`;
  }
});


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

let highScore = localStorage.getItem("highScore")
                ? parseInt(localStorage.getItem("highScore"))
                : 0;

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
  const x = Math.random() * (canvas.width - size - 10) + 5;
  const y = - size;
  const speed = 2 + Math.random() * 2;
  const sway = 0.5 + Math.random() * 0.5;

  const random = Math.random()
  let type;

  if (random < 0.65) {
    type = "green"
  } else if (random < 0.85) {
    type = "red";
  } else if (random < 0.95) {
    type = "yellow"
  } else if (random < 0.98) {
    type = "rainbow";
  } else {
    type = "black"
  }

  const image = new Image();
  if (type === "green") {
    image.src = "images/greenLeaf.png";
  } else if (type === "red"){
    image.src = "images/redLeaf.png";
  } else if (type === "yellow") {
    image.src = "images/yellowLeaf.png"
  } else if (type === "rainbow") {
    image.src = "images/rainbowLeaf.png";
  } else if (type === "black") {
    image.src = "images/blackLeaf.png"
  }

  leaves.push({ x, y, size, speed, type, image, sway, swayDir: Math.random() < 0.5 ? 1 : -1})
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
        leaf.x += Math.sin(leaf.y * 0.03) * leaf.sway;
        
        if (leaf.x < 0) leaf.x = 0;
        if (leaf.x + leaf.size > canvas.width) leaf.x = canvas.width - leaf.size;

        if (isLeafCaught(leaf)) {
          if (leaf.type === "green") {
            score += 1;
            catchSound.currentTime = 0;
            catchSound.play();
          } else if (leaf.type === "red") {
            score -= 1;
            wrongSound.currentTime = 0;
            wrongSound.play();
          } else if (leaf.type === "yellow") {
            score += Math.floor(2 + Math.random() * 2)
            bonusSound.currentTime = 0;
            bonusSound.play();
          } else if (leaf.type === "rainbow") {
            score += 5;
            doubleBonusSound.currentTime = 0;
            doubleBonusSound.play();
          } else if (leaf.type === "black") {
            gameOver = true;
            gameOverSound.currentTime = 0;
            gameOverSound.play();
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
  ctx.fillText("High Score: " + highScore, 620, 40);
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

startBtn.addEventListener("click", () => {
    startScreen.style.display = "none"
    gameContainer.style.display = "block"
    gameOverScreen.style.display = "none"
    score = 0;
    gameOver = false;
    leaves.length = 0;
    ctx.textAlign = "left";
    game();
    bgMusic.currentTime = 0;
    bgMusic.play();
})

function showGameOver() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  gameOverScreen.style.display ="flex"
  finalScore.textContent = `Final Score: ${score}`
  highScoreDisplay.textContent = `High Score: ${highScore}`;
  gameContainer.style.display = "none"
  bgMusic.pause();
}

const originalDrawGameOver = drawGameOver;

drawGameOver = function () {
  originalDrawGameOver();
  showGameOver();
}

restartBtn.addEventListener("click", () => {
  gameOverScreen.style.display = "none"
  startScreen.style.display = "flex"
})