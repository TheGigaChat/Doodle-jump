// board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

// doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth / 2 - doodlerWidth / 2;
let doodlerY = (boardHeight * 7) / 8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
  img: null,
  x: doodlerX,
  y: doodlerY,
  w: doodlerWidth,
  h: doodlerHeight,
};

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let gameOver = false;
let platformFall = 0;

// physics
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -5;
let gravity = 0.15;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  //draw doodler "green rect"
  /*   context.fillStyle = "green";
  context.fillRect(doodler.x, doodler.y, doodler.width, doodler.height); */

  //load images
  doodlerRightImg = new Image();
  doodlerRightImg.src = "img/doodler-right.png";
  doodler.img = doodlerRightImg;
  doodlerRightImg.onload = function () {
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.w, doodler.h);
  };

  doodlerLeftImg = new Image();
  doodlerLeftImg.src = "img/doodler-left.png";

  platformImg = new Image();
  platformImg.src = "img/platform.png";

  velocityY = initialVelocityY;
  placePlatforms();
  requestAnimationFrame(update);
  document.addEventListener("keydown", moveDoodler);
};

function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);

  //draw doodler infinite times
  doodler.x += velocityX;
  if (doodler.x > board.width) {
    doodler.x = 0;
  } else if (doodler.x < 0 - doodler.w) {
    doodler.x = board.width;
  }

  velocityY += gravity;
  doodler.y += velocityY;
  if (doodler.y > board.height) {
    gameOver = true;
  }

  context.drawImage(doodler.img, doodler.x, doodler.y, doodler.w, doodler.h);

  //platform draw
  for (let i = 0; i < platformArray.length; i++) {
    let platform = platformArray[i];
    if (velocityY < 0 && doodler.y <= boardHeight / 1.5) {
      platform.y -= initialVelocityY + 2;
    }

    if (detectCollision(doodler, platform) && velocityY >= 0) {
      velocityY = initialVelocityY;
    }
    context.drawImage(
      platform.img,
      platform.x,
      platform.y,
      platform.w,
      platform.h
    );
  }

  //clear and add new platforms
  while (platformArray.length > 0 && platformArray[0].y > boardHeight) {
    platformArray.shift();
    newPlatform();
    platformFall++;
  }

  //score updating
  updateScore();
  context.fillStyle = "black";
  context.font = "16px sans-serif";
  context.fillText(score, 5, 20);

  if (gameOver) {
    context.fillText(
      `Game Over: your score is ${score}!`,
      boardWidth / 5,
      (boardHeight * 7) / 8
    );
    context.fillText(
      `Press 'space' to restart game`,
      boardWidth / 5,
      (boardHeight * 7) / 8 + 20
    );
  }
}

function moveDoodler(e) {
  if (e.code == "KeyD") {
    velocityX = 4;
    doodler.img = doodlerRightImg;
  } else if (e.code == "KeyA") {
    velocityX = -4;
    doodler.img = doodlerLeftImg;
  } else if (e.code == "Space" && gameOver) {
    //reset
    doodler = {
      img: doodlerRightImg,
      x: doodlerX,
      y: doodlerY,
      w: doodlerWidth,
      h: doodlerHeight,
    };
    score = 0;
    platformFall = 0;
    velocityY = initialVelocityY;
    velocityX = 0;
    gameOver = false;
    placePlatforms();
  }
}

function placePlatforms() {
  platformArray = [];

  let platform = {
    img: platformImg,
    x: boardWidth / 2,
    y: boardHeight - 50,
    w: platformWidth,
    h: platformHeight,
  };

  platformArray.push(platform);

  for (let i = 0; i < 6; i++) {
    let platformRandomX = Math.floor((Math.random() * boardWidth * 5) / 6);
    platform = {
      img: platformImg,
      x: platformRandomX,
      y: boardHeight - 150 - 75 * i,
      w: platformWidth,
      h: platformHeight,
    };
    platformArray.push(platform);
  }
}

function newPlatform() {
  let platformRandomX = Math.floor((Math.random() * boardWidth * 5) / 6);
  let platform = {
    img: platformImg,
    x: platformRandomX,
    y: -platformHeight,
    w: platformWidth,
    h: platformHeight,
  };
  platformArray.push(platform);
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

function updateScore() {
  /* let points = Math.floor(Math.random() * 20); */
  score = platformFall;
}
