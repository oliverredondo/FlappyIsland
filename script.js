// Declaration of global variables for game elements and state
let birdEl,
  instructionTextEl,
  gameDisplayEl,
  groundEl,
  skyEl,
  currentScore,
  highestScore;
let score = 0;
let highScore;
let birdLeft = 220;
let birdBottom = 100;
let isInvincible = false;
let gravity = 1;
let isGameOver = false;
let gap = 475;
let lives = 3;
let allowInitGame = true;
let obstacleTimers = []; // Array to store timer IDs

// Arrays containing CSS classes for obstacle elements
let classNamesTop = [
  "topObstacleFork",
  "topObstacleKnife",
  "topObstaclePipe",
  "topObstacleSalmon",
];
let classNamesBottom = [
  "obstacleFork",
  "obstacleKnife",
  "obstaclePipe",
  "obstacleCoffee",
  "obstacleKhadija",
  "obstacleSalmon",
  "obstacleEskilCool",
  "obstacleEskilBreak",
  "obstacleSmoke",
];

// Event listener to initialize the game when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Assign DOM elements to variables
  birdEl = document.querySelector("#bird");
  instructionTextEl = document.querySelector("#instructionText");
  gameDisplayEl = document.querySelector("#gameDisplay");
  groundEl = document.querySelector("#movingGround");
  skyEl = document.querySelector("#movingSky");
  currentScore = document.querySelector("#currentScore");
  highestScore = document.querySelector("#highestScore");

  // Initialize game elements and set up event listeners
  initializeGameElements(
    gameDisplayEl,
    groundEl,
    skyEl,
    currentScore,
    highestScore
  );
  setupEventListeners();
});

// Function to update the player's score
function updateScore() {
  score++;
  // Check if the current score surpasses the highest score
  if (score > highScore) {
    // Update local storage with the new highest score
    localStorage.setItem(
      "flappyBirdData",
      JSON.stringify({ score, highestScore: score })
    );
    // Update the displayed highest score
    setHighscore({
      score: score,
    });
    highestScore.textContent = `Highest Score: ${score}`;
  }
  // Update the displayed current score
  currentScore.textContent = `Current Score: ${score}`;
}

// Function to set and update the highest score in local storage
function setHighscore(highscore) {
  // Use the same key "flappyBirdData" consistently
  localStorage.setItem(
    "flappyBirdData",
    JSON.stringify({ score: highscore.score, highestScore: highscore.score })
  );
}

// Function to retrieve the highest score from local storage
function getHighscore() {
  // Use the same key "flappyBirdData" consistently
  const storedData = JSON.parse(localStorage.getItem("flappyBirdData")) || {
    score: 0,
    highestScore: 0,
  };
  return storedData.highestScore;
}

// Function to initialize game elements and set initial scores
function initializeGameElements() {
  // Retrieve the highest score from local storage
  highScore = getHighscore();

  // Initialize the displayed scores
  currentScore.textContent = `Current Score: ${score}`;
  highestScore.textContent = `Highest Score: ${highScore}`;
}

// Function to get a random class for the top obstacle
function getRandomTopObstacleClass(classNames) {
  let randomIndexTop = Math.floor(Math.random() * classNamesTop.length);
  return classNamesTop[randomIndexTop];
}

// Function to get a random class for the bottom obstacle
function getRandomBottomObstacleClass(classNames) {
  let randomIndexBottom = Math.floor(Math.random() * classNamesBottom.length);
  return classNamesBottom[randomIndexBottom];
}

function updateLivesDisplay() {
  document.getElementById("lives").innerText = "LIVES: " + lives;
}

// Function to display the game over popup
function displayGameOverPopup() {
  let popupEl = document.querySelector("#gameOverPopup");
  popupEl.style.display = "block";

  document.addEventListener("keydown", (e) => {
    // console.log(e);
    if (e.key === "Enter") {
      restartGame();
    }
  });
}

// Define startGame function
function startGame() {
  // Move the bird up if it's above the ground, else keep it at the ground level
  if (birdBottom > 15) {
    birdBottom -= gravity;
    birdEl.style.bottom = birdBottom + "px";
    birdEl.style.left = birdLeft + "px";
  } else {
    // Stop the bird from going below the ground level
    birdBottom = 15;
    birdEl.style.bottom = birdBottom + "px";
  }
}

// Function to initiate the game and set up initial configurations
function initiateGame() {
  birdBottom = 100;
  birdEl.style.bottom = birdBottom + "px";
  isGameOver = false;
  // Start the game loop and obstacle generation
  gameTimerId = setInterval(startGame, 20);
  generateObstacle();

  // Initialize and play sounds
  let collisionSound = document.querySelector("#collisionSound");
  let spacebarSound = document.querySelector("#spacebarSound");
  let okeyLetsGo = document.querySelector("#okeyLetsGo");

  collisionSound.pause(); // Pause the collision sound initially
  spacebarSound.pause(); // Pause the spacebar sound initially
  okeyLetsGo.play(); // Play the start game sound
}

// Function to handle the "S" key press and call initiateGame function
function handleKeyPress(e) {
  if ((allowInitGame && e.key === "s") || e.key === "S") {
    initiateGame(); // Call the initiateGame function when the "S" key is pressed
    allowInitGame = false; // Disable further "S" key presses
    instructionTextEl.style.opacity = 0;
    okeyLetsGo.play();
  }
}

// Function to change the avatar by pressing numbers 1 to 3
function changeBird(e) {
  if (e.key === "1") {
    bird.classList.remove("pikachu", "nyan");
    bird.classList.add("bird");
    birdSound.play();
  }
}

function changeBirdPikachu(e) {
  if (e.key === "2") {
    bird.classList.remove("bird", "nyan");
    bird.classList.add("pikachu");
    pikachuSound.play();
  }
}

function changeBirdNyan(e) {
  if (e.key === "3") {
    bird.classList.remove("bird", "pikachu");
    bird.classList.add("nyan");
    nyanSound.play();
  }
}

// Function to execute a jump when the spacebar is pressed
function executeJump() {
  // Increase the bird's bottom position to simulate a jump
  if (birdBottom < 500) birdBottom += 50;
  birdEl.style.bottom = birdBottom + "px";
  console.log(birdBottom);
}

// Function to handle user control (spacebar press for jump)
function handleUserControl(e) {
  if (e.key === " ") {
    executeJump();
    spacebarSound.play();
  }
}

// Function to decrease the count of remaining lives
function decreaseLiveCount() {
  if (lives > 0) {
    lives--;
    updateLivesDisplay();

    // Play the collision sound only if lives are greater than 0
    collisionSound.play();
  }
}

// Function to check if the player has remaining lives
function checkRemainingLives() {
  if (lives <= 0) {
    // If no lives left, show game over popup and end the game
    displayGameOverPopup();
    gameOver();

    // Pause the collision sound when the game is over
    collisionSound.pause();
  }
}

// Function to generate new obstacles at intervals
function generateObstacle() {
  let obstacleLeft = 1200;

  // Generate a random height for the obstacle
  let randomHeight = Math.random() * 150;
  let obstacleBottom = randomHeight;

  // Create HTML elements for the obstacle and its top counterpart
  let obstacle = document.createElement("div");
  let topObstacle = document.createElement("div");

  // Get random obstacle classes for styling
  let randomClassTop = getRandomTopObstacleClass(classNamesTop);
  let randomClassBottom = getRandomBottomObstacleClass(classNamesBottom);

  // Add obstacle classes if the game is not over
  if (!isGameOver) {
    obstacle.classList.add(randomClassBottom);
    topObstacle.classList.add(randomClassTop);
  }

  // Append obstacles to the game display
  gameDisplayEl.appendChild(obstacle);
  gameDisplayEl.appendChild(topObstacle);

  // Set initial positions for the obstacles
  obstacle.style.left = obstacleLeft + "px";
  topObstacle.style.left = obstacleLeft + "px";
  obstacle.style.bottom = obstacleBottom + "px";
  topObstacle.style.bottom = obstacleBottom + gap + "px";

  // Set up a timer to move the obstacles
  let timerId = setInterval(moveObstacle, 20);

  // Push the timerId into the array for later cleanup
  obstacleTimers.push(timerId);

  // Function to move the obstacles
  function moveObstacle() {
    // Move the obstacles to the left
    obstacleLeft -= 2;
    obstacle.style.left = obstacleLeft + "px";
    topObstacle.style.left = obstacleLeft + "px";

    // Check for collision with the bird or reaching top/bottom
    if (
      (obstacleLeft > 200 &&
        obstacleLeft < 280 &&
        birdLeft === 220 &&
        (birdBottom < obstacleBottom + 153 ||
          birdBottom > obstacleBottom + gap - 200)) ||
      birdBottom === 18
    ) {
      // Handle collision events
      if (!isInvincible) {
        console.log("collision", birdBottom);
        decreaseLiveCount();
        checkRemainingLives();
        collisionSound.play();

        // Make the bird temporarily invincible after a collision
        isInvincible = true;
        birdEl.classList.add("invincible");

        // Remove invincibility after a delay
        setTimeout(function () {
          isInvincible = false;
          birdEl.classList.remove("invincible");
        }, 2000);
      }
    }
    // Check if the obstacle is at the same position as the bird
    if (obstacleLeft === 220) {
      updateScore();
    }

    // Check if the obstacle has moved off the screen
    if (obstacleLeft === -200) {
      // Remove obstacles and clear the timer
      clearInterval(timerId);
      gameDisplayEl.removeChild(obstacle);
      gameDisplayEl.removeChild(topObstacle);
    }
  }
  // Schedule the next obstacle generation if the game is not over
  if (!isGameOver) setTimeout(generateObstacle, 3000);
}

// Function to handle game over conditions
function gameOver() {
  // Clear all obstacle timers
  obstacleTimers.forEach((timerId) => {
    clearInterval(timerId);
  });
  // Clear the game loop timer
  clearInterval(gameTimerId);
  console.log("Game over");
  isGameOver = true;

  // Remove key event listener for user control
  document.removeEventListener("keyup", handleUserControl);

  // Update CSS classes for ground and sky to indicate the game over state
  groundEl.classList.add("ground");
  groundEl.classList.remove("ground-moving");
  skyEl.classList.add("sky");
  skyEl.classList.remove("sky-moving");
}

// Function to restart the game by reloading the page
function restartGame() {
  location.reload();
  allowInitGame = true;
}

// Function to set up event listeners for user input
function setupEventListeners() {
  // Add event listener for key release
  document.addEventListener("keyup", handleUserControl);

  // Add event listener for key press
  document.addEventListener("keydown", handleKeyPress);
  document.addEventListener("keydown", changeBird);
  document.addEventListener("keydown", changeBirdPikachu);
  document.addEventListener("keydown", changeBirdNyan);
}
