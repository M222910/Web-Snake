// Game constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const boxSize = 20; // Size of each box in the grid
const rows = canvas.height / boxSize;
const cols = canvas.width / boxSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
let score = 0;
let timeLeft = 60; // Set initial time limit in seconds

// Display elements
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

// Control the snake direction with arrow keys
document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const keyPressed = event.key;
    if (keyPressed === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (keyPressed === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (keyPressed === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (keyPressed === 'ArrowRight' && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
}

// Countdown timer function
function startTimer() {
    const timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.textContent = `Time Left: ${timeLeft}s`;
        } else {
            clearInterval(timerInterval);
            endGame("Time's up!"); // End game when time runs out
        }
    }, 1000);
}

// Game loop
function gameLoop() {
    update();
    if (checkCollision()) {
        endGame("Game Over!"); // End game on collision
    }
    draw();
}

// Update snake position and check for food
function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Check if snake has eaten food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
        scoreDisplay.textContent = `Score: ${score}`;
    } else {
        snake.pop(); // Remove tail if no food eaten
    }
}

// Check collision with walls or itself
function checkCollision() {
    const head = snake[0];
    // Wall collision
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        return true;
    }
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

// Draw everything on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);

    // Draw snake in blue
    ctx.fillStyle = 'blue'; // Change snake color to blue
    snake.forEach((segment) => {
        ctx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
    });
}

// End game function
function endGame(message) {
    alert(`${message} Your final score was: ${score}`);
    resetGame();
}

// Reset game function
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    score = 0;
    timeLeft = 60; // Reset time limit
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
}

// Start the game loop and timer
setInterval(gameLoop, 100);
startTimer();
