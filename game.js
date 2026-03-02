const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const WORLD_SIZE = 3000;
const FOOD_COUNT = 300;

let score = 0;

class Snake {
  constructor() {
    this.segments = [];
    this.length = 30;
    this.speed = 3;
    this.angle = 0;

    this.x = WORLD_SIZE / 2;
    this.y = WORLD_SIZE / 2;

    for (let i = 0; i < this.length; i++) {
      this.segments.push({ x: this.x, y: this.y });
    }
  }

  update(mouseX, mouseY) {
    const dx = mouseX - canvas.width / 2;
    const dy = mouseY - canvas.height / 2;

    this.angle = Math.atan2(dy, dx);

    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    this.segments.unshift({ x: this.x, y: this.y });

    while (this.segments.length > this.length) {
      this.segments.pop();
    }
  }

  grow(amount) {
    this.length += amount;
  }

  draw(cameraX, cameraY) {
    ctx.fillStyle = "#00ff88";

    for (let segment of this.segments) {
      ctx.beginPath();
      ctx.arc(
        segment.x - cameraX,
        segment.y - cameraY,
        8,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
}

class Food {
  constructor() {
    this.x = Math.random() * WORLD_SIZE;
    this.y = Math.random() * WORLD_SIZE;
    this.size = 5 + Math.random() * 4;
  }

  draw(cameraX, cameraY) {
    ctx.fillStyle = "#ff44ff";
    ctx.beginPath();
    ctx.arc(
      this.x - cameraX,
      this.y - cameraY,
      this.size,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

const snake = new Snake();
const foods = [];

for (let i = 0; i < FOOD_COUNT; i++) {
  foods.push(new Food());
}

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function checkFoodCollision() {
  for (let i = foods.length - 1; i >= 0; i--) {
    const dx = snake.x - foods[i].x;
    const dy = snake.y - foods[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 12) {
      snake.grow(5);
      score += 10;
      document.getElementById("score").innerText = "Score: " + score;
      foods.splice(i, 1);
      foods.push(new Food());
    }
  }
}

function drawGrid(cameraX, cameraY) {
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1;

  const gridSize = 100;

  for (let x = 0; x < WORLD_SIZE; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x - cameraX, 0 - cameraY);
    ctx.lineTo(x - cameraX, WORLD_SIZE - cameraY);
    ctx.stroke();
  }

  for (let y = 0; y < WORLD_SIZE; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0 - cameraX, y - cameraY);
    ctx.lineTo(WORLD_SIZE - cameraX, y - cameraY);
    ctx.stroke();
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cameraX = snake.x - canvas.width / 2;
  const cameraY = snake.y - canvas.height / 2;

  drawGrid(cameraX, cameraY);

  snake.update(mouseX, mouseY);
  snake.draw(cameraX, cameraY);

  for (let food of foods) {
    food.draw(cameraX, cameraY);
  }

  checkFoodCollision();

  requestAnimationFrame(gameLoop);
}

gameLoop();
