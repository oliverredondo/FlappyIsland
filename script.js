document.addEventListener("DOMContentLoaded", () => {
  // Initialize DOM elements
  const bird = document.querySelector("#bird");
  const gameDisplay = document.querySelector(".game");
  const ground = document.querySelector(".ground-moving");
  const sky = document.querySelector(".sky-moving");

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
  let gravity = 2;
  let isGameOver = false;
  let gap = 475;

  // Define startGame function
  function startGame() {
    birdBottom -= gravity;
    bird.style.bottom = birdBottom + "px";
    bird.style.left = birdLeft + "px";
  }
  let gameTimerId = setInterval(startGame, 20);

  function control(e) {
    if (e.keyCode === 32) {
      jump();
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
      }
      if (
        (obstacleLeft > 200 &&
          obstacleLeft < 280 &&
          birdLeft === 220 &&
          (birdBottom < obstacleBottom + 153 ||
            birdBottom > obstacleBottom + gap - 200)) ||
        birdBottom === 18
      ) {
        gameOver();
        clearInterval(timerId);
      }
    }
    if (!isGameOver) setTimeout(generateObstacle, 3000);
  }
  generateObstacle();

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
