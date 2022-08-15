"use strict";
const snakeElement = document.getElementById("idSnake");
const startButton = document.getElementById("idStart");
const playArea = document.getElementById("idPlayArea");
const borders = document.getElementsByClassName("borderClass");
const difficulties = document.getElementsByClassName("difficultyButtons");
const food = document.createElement("div");
food.setAttribute("id", "idFood");
const score = document.getElementById("score");
const ouroboros = document.getElementById("idOuroboros")

const snake = {
  x: 350,
  y: 20,
  size: 0,
  speed: 1,
  ouroboros: true,
  tail_x: [],
  tail_y: [],
  tailArr: [],
  color: 0,

  createTail: function () {
    this.tailArr[this.size - 1] = document.createElement("span");
    this.color++;
    if (this.color === 3) {
      console.log(this.color);
      this.tailArr[this.size - 1].style.backgroundColor =
        "rgb(49, 31, 26)";
      this.color = 0;
    }
    return document.body.appendChild(snake.tailArr[snake.size - 1]);
  },
};

var food_x = null;
var food_y = null;

borders[0].disabled = true;
var score_number = 0;
var border_number = 0;
var initial_direction = 68;
var direction = 68;
var time = setInterval;
addEventListener("keydown", (e) => directionCheck(e.which));

let directionCheck = (d) => {
  if (
    // Blocking the opposite direciton
    (initial_direction === 87 || initial_direction === 38) &&
    (d === 83 || d === 40)
  ) {
    direction = initial_direction;
  } else if (
    (d === 87 || d === 38) &&
    (initial_direction === 83 || initial_direction === 40)
  ) {
    direction = initial_direction;
  } else if (
    (initial_direction === 65 || initial_direction === 37) &&
    (d === 68 || d === 39)
  ) {
    direction = initial_direction;
  } else if (
    (d === 65 || d === 37) &&
    (initial_direction === 68 || initial_direction === 39)
  ) {
    direction = initial_direction;
  } else if (
    d === 87 ||
    d === 38 ||
    d === 83 ||
    d === 40 ||
    d === 65 ||
    d === 37 ||
    d === 68 ||
    d === 39
  ) {
    direction = d;
    initial_direction = d;
    start();
  } else {
    direction = initial_direction;
  }
};

let play = () => {
  // Checking the borders
  if (!borderCheck()) {
    gameover();
  } else if (!tailCheck()) {
    gameover();
  } else {
    switch (direction) {
      // direction control
      case 87: // up
      case 38:
        snake.y -= snake.speed;
        snakeElement.style.top = snake.y + "px";
        break;
      case 83: // down
      case 40:
        snake.y += snake.speed;
        snakeElement.style.top = snake.y + "px";
        break;
      case 65: // left
      case 37:
        snake.x -= snake.speed;
        snakeElement.style.left = snake.x + "px";
        break;
      case 68: // right
      case 39:
        snake.x += snake.speed;
        snakeElement.style.left = snake.x + "px";
        break;
      default:
        console.log("Undefined Input:", direction);
    }
    foodEaten();
    tailMovement();
  }
};

let tailCheck = () => {
  if (snake.ouroboros === false)
  {
    return true;
  }
  else {
    let dx = 0;
    let dy = 0;
    let distance = 0;
    for (let i = 2; i < snake.size + 1; i++) {
      // Will not collide with the first tail
      dx = snake.x - snake.tail_x[(i * 20) / snake.speed];
      dy = snake.y - snake.tail_y[(i * 20) / snake.speed];
      distance = Math.sqrt(dx * dx + dy * dy);
  
      if (distance < 18) {
        return false;
      }
    }
    return true;
  }
};

let tailMovement = () => {
  snake.tail_x.unshift(snake.x);
  snake.tail_y.unshift(snake.y);

  if (snake.tail_y.length > snake.size * 20 + 20) {
    snake.tail_x.pop();
    snake.tail_y.pop();
  }

  for (let i = 1; i < snake.size + 1; i++) {
    snake.tailArr[i - 1].style.left =
      snake.tail_x[Math.floor((i * 20) / snake.speed)] + "px";
    snake.tailArr[i - 1].style.top =
      snake.tail_y[Math.floor((i * 20) / snake.speed)] + "px";
  }
};

let foodEaten = () => {
  if (
    ((food_x > snake.x && food_x < snake.x + 20) ||
      (food_x + 10 > snake.x && food_x + 10 < snake.x + 20)) &&
    ((food_y > snake.y && food_y < snake.y + 20) ||
      (food_y + 10 > snake.y && food_y + 10 < snake.y + 20))
  ) {
    snake.size++;
    snake.createTail();

    food_x = getRandomInt(350, 1138);
    food_y = getRandomInt(20, 608);
    food.style.left = food_x + "px";
    food.style.top = food_y + "px";

    score_number += snake.speed;
    score.innerText = "Score: " + score_number;
  }
};

let createFood = () => {
  food.style.width = "12px";
  food.style.height = "12px";
  food.style.background = "green";
  food.style.position = "absolute";
  food.style.zIndex = 2;

  food_x = getRandomInt(350, 1138);
  food_y = getRandomInt(20, 608);
  food.style.left = food_x + "px";
  food.style.top = food_y + "px";
  document.body.appendChild(food);
  //left:350-1140 top:20-610
};

let start = () => {
  if (!startButton.disabled) {
    initial_direction = 68;
    direction = 68;
    createFood();
    score.innerText = "Score: 0";
    time = setInterval(play, 1);
    startButton.disabled = true;
    // difficulties.forEach((element) => {
    //   element.style.backgroundColor = "rgb(12, 12, 200)";
    // });
    // for (const e of difficulties) {
    //   e.style.backgroundColor = "rgb(12,12,12)";
    // }
  }
};

let gameover = () => {
  if (startButton.disabled) {
    clearInterval(time);
    alert("Game Over");
    snake.x = 350;
    snake.y = 20;
    snake.tail_x = [];
    snake.tail_y = [];
    for (let i = 0; i < snake.size; i++) {
      snake.tailArr[i].remove();
    }
    snake.tailArr = [];
    snake.size = 0;
    score_number = 0;
    snakeElement.style.top = "20px";
    snakeElement.style.left = "350px";

    food.remove();
    startButton.disabled = false;

    initial_direction = 68;
    direction = 68;
  }
};

let borderCheck = () => {
  switch (border_number) {
    case 0:
      if (snake.y < 20) {
        snake.y = 600;
      } else if (snake.x > 1130) {
        snake.x = 350;
      } else if (snake.x < 350) {
        snake.x = 1130;
      } else if (snake.y > 600) {
        snake.y = 20;
      }
      return true;
    case 1:
      if (snake.y < 20 || snake.y > 600) {
        return false;
      } else if (snake.x > 1130) {
        snake.x = 350;
      } else if (snake.x < 350) {
        snake.x = 1130;
      }
      return true;
    case 2:
      if (snake.x < 350 || snake.x > 1130) {
        return false;
      } else if (snake.y < 20) {
        snake.y = 600;
      } else if (snake.y > 600) {
        snake.y = 20;
      }
      return true;
    case 3:
      if (
        snake.y < 20 ||
        snake.y > 600 ||
        snake.x < 350 ||
        snake.x > 1130
      ) {
        return false;
      }
      return true;
    default:
      console.log("Border Error");
  }
};

let border_func = (b_number) => {
  switch (b_number) {
    case 0:
      border_number = b_number;
      playArea.style.borderColor = "rgb(100, 100, 255)";
      borders[0].disabled = true;
      borders[1].disabled = false;
      borders[2].disabled = false;
      borders[3].disabled = false;
      break;
    case 1:
      border_number = b_number;
      playArea.style.borderTopColor = "rgb(150, 20, 20)";
      playArea.style.borderBottomColor = "rgb(150, 20, 20)";
      playArea.style.borderLeftColor = "rgb(100, 100, 255)";
      playArea.style.borderRightColor = "rgb(100, 100, 255)";
      borders[0].disabled = false;
      borders[1].disabled = true;
      borders[2].disabled = false;
      borders[3].disabled = false;
      break;
    case 2:
      border_number = b_number;
      playArea.style.borderTopColor = "rgb(100, 100, 255)";
      playArea.style.borderBottomColor = "rgb(100, 100, 255)";
      playArea.style.borderLeftColor = "rgb(150, 20, 20)";
      playArea.style.borderRightColor = "rgb(150, 20, 20)";
      borders[0].disabled = false;
      borders[1].disabled = false;
      borders[2].disabled = true;
      borders[3].disabled = false;
      break;
    case 3:
      border_number = b_number;
      playArea.style.borderColor = "rgb(150, 20, 20)";
      borders[0].disabled = false;
      borders[1].disabled = false;
      borders[2].disabled = false;
      borders[3].disabled = true;
      break;
  }
};

let difficulty = (d) => {
  switch (d) {
    case 0:
      snake.speed = 1;
      difficulties[0].disabled = true;
      difficulties[1].disabled = false;
      difficulties[2].disabled = false;
      break;
    case 1:
      snake.speed = 2;
      difficulties[0].disabled = false;
      difficulties[1].disabled = true;
      difficulties[2].disabled = false;
      break;
    case 2:
      snake.speed = 3;
      difficulties[0].disabled = false;
      difficulties[1].disabled = false;
      difficulties[2].disabled = true;
      break;
  }
};

let ouroborosSwitch = () => {
  if (snake.ouroboros === true)
  {
    snake.ouroboros = false;
    ouroboros.style.backgroundColor = "rgb(100, 10, 10)";
  }
  else
  {
    snake.ouroboros = true;
    ouroboros.style.backgroundColor = "rgb(20, 110, 60)";

  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}