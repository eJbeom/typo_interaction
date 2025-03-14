import Point from "./point.js";
import { X_MOVE_SCOPE, Y_MOVE_SCOPE, MOVE_SPEED } from "./constants.js";

export default class Text {
  constructor(char, fontSize, pos) {
    this.char = char;
    this.fontSize = fontSize;
    this.pos = pos ?? new Point();
    this.vel = new Point();
    this.acc = new Point();
    this.angle = 0;
    this.moveSpeed = MOVE_SPEED;
    this.xScope = X_MOVE_SCOPE;
    this.yScope = Y_MOVE_SCOPE;
    this.textWidth = 0;
    this.textHeight = 0;
    this.additionalRadius = 10;
    this.radius = 0 + this.additionalRadius;
    this.target = new Point(
      this.pos.x + Math.random() * this.xScope - this.xScope / 2,
      this.pos.y + Math.random() * this.yScope + this.yScope / 2
    );
  }

  init(ctx) {
    const textInfo = ctx.measureText(this.char);
    this.textWidth = textInfo.width;
    this.textHeight =
      textInfo.actualBoundingBoxAscent + textInfo.actualBoundingBoxDescent;
    this.radius += this.textWidth / 2;
  }

  animate(ctx) {
    this.pos.x = this.bogan(this.pos.x, this.target.x, this.moveSpeed);
    this.pos.y = this.bogan(this.pos.y, this.target.y, this.moveSpeed);

    this.update();

    this.drawText(ctx);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.angle += 0.024;
  }

  drawText(ctx) {
    ctx.save();

    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.angle);
    ctx.fillText(this.char, -this.textWidth / 2, this.textHeight / 2);

    ctx.restore();
  }

  bogan(cur, target, speed) {
    return cur + (target - cur) * speed;
  }

  measureDistance(otherPos) {
    return Math.sqrt(
      Math.pow(otherPos.x - this.pos.x, 2) +
        Math.pow(otherPos.y - this.pos.y, 2)
    );
  }

  addRadii(otherRadius) {
    return this.radius + otherRadius + this.additionalRadius * 2;
  }

  isDead(width, height) {
    if (
      this.pos.x - this.radius > width ||
      this.pos.x < 0 - this.radius ||
      this.pos.y - this.radius > height
    ) {
      return true;
    }

    return false;
  }

  setPos(data, type) {
    this.pos[type](data);
  }

  setVel(data, type) {
    this.vel[type](data);
  }

  getPos() {
    return this.pos.clone();
  }

  getVel() {
    return this.vel.clone();
  }
}
