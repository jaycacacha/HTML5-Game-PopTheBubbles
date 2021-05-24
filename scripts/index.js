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

function Animate() {
  _context.clearRect(0, 0, canvas_.width, canvas_.height);
  HandleBackground();
  handleBubbles();
  handlePlayer();
  gameFrame++;
  requestAnimationFrame(Animate);
}
Animate();
