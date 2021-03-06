//Setup Canvas
const canvas_ = document.getElementById("_canvas");
const _context = canvas_.getContext("2d");
canvas_.width = 800;
canvas_.height = 500;

let score = 0;
let gameFrame = 0;
_context.font = "50px Kavivanar";
let gameSpeed = 1;
let gameOver = false;
let isPaused = false;

let canvasPosition = canvas_.getBoundingClientRect();

const mouse = {
  x: canvas_.width / 2,
  y: canvas_.height / 2,
  click: false,
};

canvas_.addEventListener("mousedown", function (event) {
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
});

canvas_.addEventListener("mouseup", function (event) {
  mouse.click = false;
});

const playerLookLeft = new Image();
playerLookLeft.src = "assets/player/__yellow_cartoon_fish_01_swim.png";

const playerLookRight = new Image();
playerLookRight.src = "assets/player/__yellow_cartoon_fish_01_swim_flipped.png";

//Create Player
class Player {
  constructor() {
    this.x = canvas_.width;
    this.y = canvas_.height / 2;
    this.radius = 50;
    this.angle = 20;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 418;
    this.spriteHeight = 397;
  }
  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    let theta = Math.atan2(dy, dx);
    this.angle = theta;
    if (mouse.x != this.x) {
      this.x -= dx / 20;
    }
    if (mouse.y != this.y) {
      this.y -= dy / 20;
    }
  }
  draw() {
    if (mouse.click) {
      _context.lineWidth = 0.2;
      _context.beginPath();
      _context.moveTo(this.x, this.y);
      _context.lineTo(mouse.x, mouse.y);
      _context.stroke();
    }

    _context.save();
    _context.translate(this.x, this.y);
    _context.rotate(this.angle);

    if (this.x >= mouse.x) {
      _context.drawImage(
        playerLookLeft,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 50,
        0 - 55,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    } else {
      _context.drawImage(
        playerLookRight,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 50,
        0 - 55,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    }
    _context.restore();
  }
}
const player = new Player();
function handlePlayer() {
  player.update();
  player.draw();
}

const bubblesArray = [];
const bubbleImg = new Image();
bubbleImg.src = "assets/environment/bubble_pop_frame_01.png";

class Bubble {
  constructor() {
    this.x = Math.random() * canvas_.width;
    this.y = canvas_.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 2 + 1.2;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";
  }
  update() {
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }
  draw() {
    _context.drawImage(
      bubbleImg,
      this.x - 65,
      this.y - 65,
      this.radius * 2.6,
      this.radius * 2.6
    );
  }
}
const bubblePop1 = document.createElement("audio");
bubblePop1.src = "sounds/pop1.wav";
const bubblePop2 = document.createElement("audio");
bubblePop2.src = "sounds/pop2.mp3";

function handleBubbles() {
  if (gameFrame % 50 === 0) {
    bubblesArray.push(new Bubble());
  }
  for (let i = 0; i < bubblesArray.length; i++) {
    bubblesArray[i].update();
    bubblesArray[i].draw();
    if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {
      bubblesArray.splice(i, 1);
      i--;
    } else if (
      bubblesArray[i].distance <
      bubblesArray[i].radius + player.radius
    ) {
      if (!bubblesArray[i].counted) {
        if (bubblesArray[i].sound == "sound1") {
          bubblePop1.play();
        } else {
          bubblePop2.play();
        }
        score += 1;
        bubblesArray[i].counted = true;
        bubblesArray.splice(i, 1);
        i--;
      }
    }
  }
}
const backgroundImg = new Image();
backgroundImg.src = "assets/environment/background.png";

const BG = {
  x1: 0,
  x2: canvas_.width,
  y: 0,
  width: canvas_.width,
  height: canvas_.height,
};
function HandleBackground() {
  BG.x1 -= gameSpeed;
  if (BG.x1 < -BG.width) BG.x1 = BG.width;
  BG.x2 -= gameSpeed;
  if (BG.x2 < -BG.width) BG.x2 = BG.width;
  _context.drawImage(backgroundImg, BG.x1, BG.y, BG.width, BG.height);
  _context.drawImage(backgroundImg, BG.x2, BG.y, BG.width, BG.height);
}

const enemy1 = new Image();
enemy1.src = "assets/environment/__cartoon_fish_06_green_swim.png";
const enemy2 = new Image();
enemy2.src = "assets/environment/__cartoon_fish_06_red_swim.png";

class Enemy {
  constructor() {
    this.x = canvas_.width + 150;
    this.y = Math.random() * (canvas_.height - 150) + 90;
    this.radius = 50;
    this.speed = Math.random() * 2 + 2;
    this.frame = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 498;
    this.spriteHeight = 327;
    this.image = Math.random() <= 0.5 ? "enemy1" : "enemy2";
  }
  update() {
    this.x -= this.speed;
    if (this.x < 0 - this.radius * 2) {
      this.x = canvas_.width + 200;
      this.y = Math.random() * (canvas_.height - 150) + 90;
      this.speed = Math.random() * 2 + 2;
    }
    if (gameFrame % 5 == 0) {
      this.frame++;
      if (this.frame >= 12) this.frame = 0;
      if (this.frame == 3 || this.frame == 7 || this.frame == 11) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if (this.frame < 3) this.frameY = 0;
      else if (this.frame < 7) this.frameY = 1;
      else if (this.frame < 11) this.frameY = 2;
      else this.frameY = 0;
    }
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.radius + player.radius) {
      handleGameOver();
    }
  }
  draw() {
    if (enemy.image == "enemy1") {
      _context.drawImage(
        enemy1,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 75,
        this.y - 60,
        this.spriteWidth / 3,
        this.spriteHeight / 3
      );
    } else {
      _context.drawImage(
        enemy2,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x - 75,
        this.y - 60,
        this.spriteWidth / 3,
        this.spriteHeight / 3
      );
    }
  }
}
const enemy = new Enemy();
function handleEnemy() {
  enemy.draw();
  enemy.update();
}

function handleGameOver() {
  _context.save();
  _context.fillStyle = "white";
  _context.fillText("GAME OVER", canvas_.width / 3, canvas_.height / 2);
  _context.fillText(
    "You reached " + score + " point(s)! ",
    canvas_.width / 5.2,
    (3 * canvas_.height) / 4.5
  );
  _context.font = "30px Kavivanar";
  _context.fillText(
    "Press SPACE to play again",
    canvas_.width / 3.5,
    (4.5 * canvas_.height) / 5
  );
  gameOver = true;
  _context.restore();
}

function Animate() {
  _context.clearRect(0, 0, canvas_.width, canvas_.height);
  HandleBackground();
  handleBubbles();
  handlePlayer();
  handleEnemy();
  _context.fillStyle = "black";
  _context.fillText("Score: " + score, 10, 40);
  gameFrame++;

  if (!gameOver) {
    requestAnimationFrame(Animate);
  }
}
Animate();

window.addEventListener("resize", function () {
  canvasPosition = canvas_.getBoundingClientRect();
});

document.onkeydown = function (event) {
  if (event.keyCode === 32) {
    //spacebar
    if (gameOver) {
      location.reload();
    }
  }
};
