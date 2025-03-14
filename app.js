import Point from "./point.js";
import textManager from "./textmanager.js";
import {
  WORD,
  TEXT_LENGTH,
  FONT_SIZE,
  SPLIT_CRITERION,
  YPOS_VEL,
} from "./constants.js";

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    this.word = WORD.split(SPLIT_CRITERION);
    this.textLength = TEXT_LENGTH;
    this.fontSize = FONT_SIZE;

    this.yPos = 0; // ctx translate-y value
    this.yVel = YPOS_VEL;
    this.textManager = new textManager(this.textLength);
    this.mousePos = new Point();

    window.addEventListener("resize", this.init.bind(this));
    this.init();

    window.addEventListener("mousedown", this.onDown.bind(this));
    window.addEventListener("mouseup", this.onUp.bind(this));
    window.addEventListener("mousemove", this.onMove.bind(this));

    window.requestAnimationFrame(this.animate.bind(this));
  }

  init() {
    this.stageWidth = this.canvas.clientWidth;
    this.stageHeight = this.canvas.clientHeight;

    this.pixelRatio = window.devicePixelRatio;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;

    this.textManager.init(this.stageWidth, this.stageHeight);
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    if (this.isDown) {
      this.textManager.generateText(
        this.ctx,
        this.mousePos.x,
        this.mousePos.y - this.yPos,
        this.word[Math.floor(Math.random() * this.word.length)],
        this.fontSize
      );
    }

    this.ctx.font = `${this.fontSize}px Roboto`;
    this.ctx.fillStyle = "white";

    this.ctx.save();

    this.ctx.translate(0, this.yPos);

    this.textManager.animate(this.ctx, this.yPos);

    this.ctx.restore();

    this.yPos += this.yVel;
  }

  onDown() {
    this.isDown = true;
  }

  onUp() {
    this.isDown = false;
  }

  onMove(e) {
    if (this.isDown) {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
    }
  }
}

window.onload = () => {
  new App();
};
