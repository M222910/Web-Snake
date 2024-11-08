// Game constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const boxSize = 20; // Size of each box in the grid
const rows = canvas.height / boxSize;
const cols = canvas.width / boxSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
let specialFood = null; // Only spawn green apple occasionally
let score = 0;
let timeLeft = 60; // Initial time limit in seconds
let appleCounter = 0; // Track the number of apples eaten
let isPaused = false; // Track whether the game is paused

// Display elements
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

// Control the snake direction with arrow keys and toggle pause with 'P'
document.addEventListener('keydown', (event) => {
    const keyPressed = event.key;
    if (keyPressed === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (keyPressed === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (keyPressed === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (keyPressed === 'ArrowRight' && direction.x === 0) {
        direction = { x: 1, y: 0 };
    } else if (keyPressed === 'p' || keyPressed === 'P') {
        isPaused = !isPaused; // Toggle pause
    }
});

// Countdown timer function
function startTimer() {
    const timerInterval = setInterval(() => {
        if (timeLeft > 0 && !isPaused) { // Only decrease time if game is not paused
            timeLeft--;
            timerDisplay.textContent = `Time Left: ${timeLeft}s`;
        } else if (timeLeft === 0) {
            clearInterval(timerInterval);
            endGame("Time's up!"); // End game when time runs out
        }
    }, 1000);
}

// Game loop
function gameLoop() {
    if (!isPaused) { // Only update and draw if the game is not paused
        update();
        if (checkCollision()) {
            endGame("Game Over!"); // End game on collision
        }
        draw();
    }
}

// Update snake position and check for food
function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Check if snake has eaten the regular food
    if (head.x === food.x && head.y === food.y) {
        score++;
        appleCounter++; // Increment apple counter
        scoreDisplay.textContent = `Score: ${score}`;

        // Every 10th apple is a green apple
        if (appleCounter === 10) {
            specialFood = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
            appleCounter = 0; // Reset counter after spawning a green apple
        } else {
            // Spawn new red apple if not 10th
            food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
        }
    } else if (specialFood && head.x === specialFood.x && head.y === specialFood.y) {
        // Check if snake has eaten special food (green apple)
        score++;
        timeLeft += 30; // Add 30 seconds to the timer
        scoreDisplay.textContent = `Score: ${score}`;
        timerDisplay.textContent = `Time Left: ${timeLeft}s`; // Update timer display

        // Clear special food after it's eaten
        specialFood = null;
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

    // Draw regular food (red apple)
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);

    // Draw special food (green apple) if it exists
    if (specialFood) {
        ctx.fillStyle = 'green';
        ctx.fillRect(specialFood.x * boxSize, specialFood.y * boxSize, boxSize, boxSize);
    }

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
    appleCounter = 0; // Reset apple counter
    isPaused = false; // Reset pause state
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    specialFood = null; // Remove any existing special food
}

// Start the game loop and timer

// Start of the script
console.log("Game script loaded successfully.");

// Toggle Pause
document.addEventListener('keydown', (event) => {
    const keyPressed = event.key;
    if (keyPressed === 'p' || keyPressed === 'P') {
        isPaused = !isPaused; // Toggle pause
        console.log("Pause toggled:", isPaused); // Debug pause state
    }
});

// Countdown timer function
function startTimer() {
    const timerInterval = setInterval(() => {
        if (timeLeft > 0 && !isPaused) { // Only decrease time if game is not paused
            timeLeft--;
            timerDisplay.textContent = `Time Left: ${timeLeft}s`;
            console.log("Timer updated:", timeLeft); // Debug timer update
        } else if (timeLeft === 0) {
            clearInterval(timerInterval);
            endGame("Time's up!"); // End game when time runs out
            console.log("Game over due to timer.");
        }
    }, 1000);
}

// Spawning new apple
function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Check if snake has eaten the regular food
    if (head.x === food.x && head.y === food.y) {
        score++;
        appleCounter++;
        scoreDisplay.textContent = `Score: ${score}`;
        console.log("Red apple eaten. Score:", score, "Apple counter:", appleCounter);

        // Every 10th apple is a green apple
        if (appleCounter === 10) {
            specialFood = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
            appleCounter = 0;
            console.log("Green apple spawned at:", specialFood);
        } else {
            // Spawn new red apple if not 10th
            food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
            console.log("Red apple spawned at:", food);
        }
    } else if (specialFood && head.x === specialFood.x && head.y === specialFood.y) {
        // Check if snake has eaten special food (green apple)
        score++;
        timeLeft += 30;
        scoreDisplay.textContent = `Score: ${score}`;
        timerDisplay.textContent = `Time Left: ${timeLeft}s`;
        console.log("Green apple eaten. Score:", score, "Time left:", timeLeft);

        // Clear special food after it's eaten
        specialFood = null;
    } else {
        snake.pop(); // Remove tail if no food eaten
    }
}

setInterval(gameLoop, 100);
startTimer();
