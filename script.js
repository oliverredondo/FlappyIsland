function restartGame() {
  // Reload the page to restart the game
  location.reload();
  allowInitGame = true;
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize DOM elements
  const bird = document.querySelector("#bird");
  const text = document.querySelector(".text");
  const gameDisplay = document.querySelector(".game");
  const ground = document.querySelector(".ground-moving");
  const sky = document.querySelector(".sky-moving");
  let collisionSound = document.getElementById("collisionSound");
  let spacebarSound = document.getElementById("spacebarSound");
  let okeyLetsGo = document.getElementById("okeyLetsGo");
  let currentScore = document.querySelector("#currentScore");
  let highestScore = document.querySelector("#highestScore");

  // setting the local storage for the game
  let score = 0;
  let highScore = getHighscore();

  currentScore.textContent = `Current Score: ${score}`;
  highestScore.textContent = `Highest Score: ${highScore}`;

  function updateScore() {
    score++;
    if (score > highScore) {
      localStorage.setItem(
        "flappyBirdData",
        JSON.stringify({ score, highestScore: score })
      );
      setHighscore({
        score: score,
      });
      highestScore.textContent = `Highest Score: ${score}`;
    }
    currentScore.textContent = `Current Score: ${score}`;
  }

  function getHighscore() {
    // Use the same key "flappyBirdData" consistently
    const storedData = JSON.parse(localStorage.getItem("flappyBirdData")) || {
      score: 0,
      highestScore: 0,
    };
    return storedData.highestScore;
  }

  function setHighscore(highscore) {
    // Use the same key "flappyBirdData" consistently
    localStorage.setItem(
      "flappyBirdData",
      JSON.stringify({ score: highscore.score, highestScore: highscore.score })
    );
  }

  // How to randomize the obstacles. Array of CSS classes
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
    "obstacleSmoke",
  ];

  function getRandomClassTop(classNames) {
    const randomIndexTop = Math.floor(Math.random() * classNamesTop.length);
    return classNamesTop[randomIndexTop];
  }

  function getRandomClassBottom(classNames) {
    const randomIndexBottom = Math.floor(
      Math.random() * classNamesBottom.length
    );
    return classNamesBottom[randomIndexBottom];
  }

  // Global variable declarations
  let birdLeft = 220;
  let birdBottom = 100;
  let isInvincible = false;
  let gravity = 1;
  let isGameOver = false;
  let gap = 475;
  let lives = 3;

  function updateLivesDisplay() {
    document.getElementById("lives").innerText = "LIVES: " + lives;
  }

  function decreaseLives() {
    lives--;
    updateLivesDisplay();
  }

  function showGameOverPopup() {
    const popup = document.getElementById("gameOverPopup");
    popup.style.display = "block";
  }

  // Define startGame function
  function startGame() {
    birdBottom -= gravity;
    bird.style.bottom = birdBottom + "px";
    bird.style.left = birdLeft + "px";
  }

  function control(e) {
    if (e.keyCode === 32) {
      jump();
      spacebarSound.play();
    }
  }

  function jump() {
    if (birdBottom < 500) birdBottom += 50;
    bird.style.bottom = birdBottom + "px";
    console.log(birdBottom);
  }

  document.addEventListener("keyup", control);

  // Array to store timer IDs
  let obstacleTimers = [];

  // Generating new obstacles

  function generateObstacle() {
    let obstacleLeft = 1024;
    let randomHeight = Math.random() * 150;
    let obstacleBottom = randomHeight;
    const obstacle = document.createElement("div");
    const topObstacle = document.createElement("div");
    const randomClassTop = getRandomClassTop(classNamesTop);
    const randomClassBottom = getRandomClassBottom(classNamesBottom);
    if (!isGameOver) {
      obstacle.classList.add(randomClassBottom);
      topObstacle.classList.add(randomClassTop);
    }
    gameDisplay.appendChild(obstacle);
    gameDisplay.appendChild(topObstacle);
    obstacle.style.left = obstacleLeft + "px";
    topObstacle.style.left = obstacleLeft + "px";
    obstacle.style.bottom = obstacleBottom + "px";
    topObstacle.style.bottom = obstacleBottom + gap + "px";

    let timerId = setInterval(moveObstacle, 20);

    // Push the timerId into the array
    obstacleTimers.push(timerId);

    // Moving the obstacles

    function moveObstacle() {
      obstacleLeft -= 2;
      obstacle.style.left = obstacleLeft + "px";
      topObstacle.style.left = obstacleLeft + "px";

      if (obstacleLeft === -200) {
        clearInterval(timerId);
        gameDisplay.removeChild(obstacle);
        gameDisplay.removeChild(topObstacle);
        updateScore();
      }
      if (
        (obstacleLeft > 200 &&
          obstacleLeft < 280 &&
          birdLeft === 220 &&
          (birdBottom < obstacleBottom + 153 ||
            birdBottom > obstacleBottom + gap - 200)) ||
        birdBottom === 18
      ) {
        if (!isInvincible) {
          console.log("collision", birdBottom);
          decreaseLives();
          lifeCheck();
          collisionSound.play();

          isInvincible = true;
          bird.classList.add("invincible");

          setTimeout(function () {
            isInvincible = false;
            bird.classList.remove("invincible");
          }, 2000);
        }
      }
    }
    if (!isGameOver) setTimeout(generateObstacle, 3000);
  }

  function lifeCheck() {
    if (lives <= 0) {
      // If no lives left, show game over popup
      showGameOverPopup();
      gameOver();
    }
  }

  document.addEventListener("keydown", function (initGame) {
    if (e.keyCode === 32) {
      jump();
      spacebarSound.play();
    }
  });

  // Function to handle the "S" key press and call initGame function
  let allowInitGame = true;

  function handleKeyPress(event) {
    if ((allowInitGame && event.key === "s") || event.key === "S") {
      initGame(); // Call the initGame function when the "S" key is pressed
      allowInitGame = false; // Disable further "S" key presses
      text.style.opacity = 0;
      okeyLetsGo.play();
    }
  }

  // Add event listener for key press
  document.addEventListener("keydown", handleKeyPress);

  function initGame() {
    birdBottom = 100;
    bird.style.bottom = birdBottom + "px";
    isGameOver = false;
    gameTimerId = setInterval(startGame, 20);
    generateObstacle();
  }

  //Enable the function below if we remove the event listener to start the game
  // initGame();

  // Game over

  function gameOver() {
    // Clear all obstacle timers
    obstacleTimers.forEach((timerId) => {
      clearInterval(timerId);
    });

    clearInterval(gameTimerId);
    console.log("Game over");
    isGameOver = true;
    document.removeEventListener("keyup", control);
    ground.classList.add("ground");
    ground.classList.remove("ground-moving");
    sky.classList.add("sky");
    sky.classList.remove("sky-moving");
  }
});
