import Text from "./text.js";
import Point from "./point.js";
import { RESTITUTION } from "./constants.js";

export default class textManager {
  constructor(maxLen, pos) {
    this.maxLen = maxLen;
    this.pos = pos ?? new Point();
    this.texts = [];
    this.yPos = 0;
    this.time = 0;
  }

  init(width, height) {
    this.maxWidth = width;
    this.maxHeight = height;
  }

  animate(ctx, yPos) {
    for (let i = this.texts.length - 1; i >= 0; i--) {
      if (this.isCleaned(i)) continue;

      this.calculateCollision(i, this.texts[i], this.texts);
      this.texts[i].animate(ctx);
    }

    this.yPos = yPos;
    this.time++;
  }

  calculateCollision(curIndex, cur, others) {
    for (let i = 0; i < others.length; i++) {
      if (i === curIndex) continue;

      const other = others[i];

      const dist = cur.measureDistance(other.pos);
      const sumRadius = cur.addRadii(other.radius);

      if (dist <= sumRadius) {
        const overlap = sumRadius - dist;
        const dirt = other.getPos().sub(cur.pos).norm();
        const restitution = RESTITUTION;

        const adjustVector = dirt.clone().mult(overlap).div(2);
        const forceVector = dirt.clone().mult(restitution);

        cur.setPos(adjustVector, "sub");
        other.setPos(adjustVector, "add");

        cur.setVel(forceVector, "sub");
        other.setVel(forceVector, "add");
      }
    }
  }

  isCleaned(i) {
    if (this.texts[i].isDead(this.maxWidth, this.maxHeight - this.yPos)) {
      this.clearText(i);

      return true;
    }

    return false;
  }

  generateText(ctx, x, y, char, fontSize) {
    if (this.texts.length === this.maxLen) return;

    if (this.time % this.smoothGeneration() === 0) {
      this.setPos(x, y);

      const text = new Text(char, fontSize, new Point(this.pos.x, this.pos.y));

      text.init(ctx);

      this.addText(text);
    }
  }

  smoothGeneration() {
    if (this.texts.length < (3 / 10) * this.maxLen) {
      return 3;
    } else if (this.texts.length < (6 / 10) * this.maxLen) {
      return 27;
    } else if (this.texts.length < this.maxLen) {
      return 50;
    }
  }

  addText(text) {
    this.texts.push(text);
  }

  clearText(i) {
    this.texts.splice(i, 1);
  }

  setPos(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }

  getPos() {
    return this.pos.clone();
  }
}
