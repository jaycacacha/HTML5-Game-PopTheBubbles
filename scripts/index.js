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
