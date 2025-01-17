// Game constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const boxSize = 20; // Size of each box in the grid
const rows = canvas.height / boxSize;
const cols = canvas.width / boxSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
let specialFood = null; // For green apples
let blackApple = null;  // For black apples
let yellowApple = null; // For yellow apples

let score = 0;
let timeLeft = 60; // Initial time limit in seconds
let appleCounter = 0; // Track the number of red apples eaten
let greenAppleCounter = 0; // Track green apples eaten
let blackAppleCounter = 0; // Track black apples eaten
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

    // Check if snake has eaten the regular food (red apple)
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
        greenAppleCounter++; // Increment green apple counter

        // Check if it's time to spawn a black apple
        if (greenAppleCounter === 3) {
            blackApple = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
            greenAppleCounter = 0; // Reset green apple counter
        }

        // Clear special food after it's eaten
        specialFood = null;
    } else if (blackApple && head.x === blackApple.x && head.y === blackApple.y) {
        // Check if snake has eaten black apple
        score--; // Black apple removes one point
        scoreDisplay.textContent = `Score: ${score}`;
        blackAppleCounter++; // Increment black apple counter

        // Check if it's time to spawn a yellow apple
        if (blackAppleCounter === 2) {
            yellowApple = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
            blackAppleCounter = 0; // Reset black apple counter
        }

        // Clear black apple after it's eaten
        blackApple = null;
    } else if (yellowApple && head.x === yellowApple.x && head.y === yellowApple.y) {
        // Check if snake has eaten yellow apple
        score += 10; // Yellow apple adds 10 points
        scoreDisplay.textContent = `Score: ${score}`;
        yellowApple = null; // Clear yellow apple after it's eaten
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

    // Self collision - only check body, not the head itself
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

    // Choose colors based on the selected theme
    let snakeColor = 'blue';
    let foodColor = 'red';
    let specialFoodColor = 'green';

    if (document.body.classList.contains('nokia-theme')) {
        snakeColor = '#00ff00';  // Green snake for Nokia theme
        foodColor = '#00ff00';   // Green food for Nokia theme
        specialFoodColor = '#00ff00';
    } else if (document.body.classList.contains('google-theme')) {
        snakeColor = '#34a853';  // Google green for snake
        foodColor = '#ea4335';   // Google red for regular food
        specialFoodColor = '#fbbc05';  // Google yellow for special food
    }

    // Draw food
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);

    // Draw special food (green apple or other) if it exists
    if (specialFood) {
        ctx.fillStyle = specialFoodColor;
        ctx.fillRect(specialFood.x * boxSize, specialFood.y * boxSize, boxSize, boxSize);
    }

    // Draw snake
    ctx.fillStyle = snakeColor;
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
    greenAppleCounter = 0;
    blackAppleCounter = 0;
    isPaused = false; // Reset pause state
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    specialFood = null;
    blackApple = null;
    yellowApple = null;
}

// Start the game loop and timer
setInterval(gameLoop, 100);
startTimer();

// Theme selector
const themeSelect = document.getElementById('themeSelect');

// Set theme based on the selected option
themeSelect.addEventListener('change', function() {
    const selectedTheme = themeSelect.value;

    // Remove all theme-related classes from body and canvas
    document.body.classList.remove('classic-theme', 'nokia-theme', 'google-theme');
    canvas.classList.remove('classic-theme', 'nokia-theme', 'google-theme');

    // Apply the selected theme
    if (selectedTheme === 'nokia') {
        document.body.classList.add('nokia-theme');
        canvas.classList.add('nokia-theme');
    } else if (selectedTheme === 'google') {
        document.body.classList.add('google-theme');
        canvas.classList.add('google-theme');
    } else {
        document.body.classList.add('classic-theme');
        canvas.classList.add('classic-theme');
    }
});

// Initialize with the classic theme
document.body.classList.add('classic-theme');
canvas.classList.add('classic-theme');
