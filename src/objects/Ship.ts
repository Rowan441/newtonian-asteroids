import { AnimatedSprite, Sprite, Texture } from "pixi.js";
import { Keyboard } from "../recipes/Keyboard";
import { Manager } from "../recipes/Manager";
import { GameOverScene } from "../scenes/GameOverScene";
import { distancebetweenPoints } from "../util";
import { Planet } from "./planet";

export class Ship {
  id: string;

  sprite: AnimatedSprite;
  shield?: Sprite;

  xPos: number;
  yPos: number;
  angle: number;

  xVel: number = 0;
  yVel: number = 0;

  dead = false;
  deathTime = 0;
  invincibleTime = 0;
  birthTime = Date.now();

  private readonly SHIP_SPEED = 0.06;
  private readonly TURNING_SPEED = (Math.PI / 180) * 5;
  private readonly SHIP_SIZE = 16;

  constructor(x: number, y: number, angles: number) {
    const shipFrames: Array<Texture> = [
      "empty",
      "ship",
      "ship_moving",
      "explosion1",
      "explosion2",
      "explosion3",
      "explosion4",
      "explosion5",
      "explosion6",
      "explosion7",
      "explosion8",
    ].map((frame) => Texture.from(frame));

    this.sprite = new AnimatedSprite(shipFrames);
    this.sprite.loop = false;
    this.sprite.animationSpeed = 0.3;
    this.sprite.onComplete = (() => {
      this.sprite.gotoAndStop(0);
      Manager.changeScene(new GameOverScene(Date.now() - this.birthTime));
    }).bind(this);

    this.id = crypto.randomUUID();
    this.sprite.anchor.set(0.5);
    this.sprite.width = this.SHIP_SIZE;
    this.sprite.height = this.SHIP_SIZE;

    this.xPos = x;
    this.yPos = y;
    this.angle = angles;
  }

  public update(framesPassed: number, objects: Planet[]) {
    if (this.dead) {
      this.handleDead();
      return;
    }

    if (Keyboard.state.get("ArrowUp")) {
      this.xVel += this.SHIP_SPEED * Math.cos(this.angle);
      this.yVel += this.SHIP_SPEED * Math.sin(this.angle);
    }
    if (Keyboard.state.get("ArrowDown")) {
      //TODO
    }
    if (Keyboard.state.get("ArrowLeft")) {
      this.angle = this.angle - this.TURNING_SPEED;
    }
    if (Keyboard.state.get("ArrowRight")) {
      this.angle = this.angle + this.TURNING_SPEED;
    }
    if (Keyboard.state.get("Space")) {
    }

    //Set ship angle
    this.sprite.rotation = this.angle + Math.PI / 2;

    if (this.xPos < 8) {
      this.xPos = 8;
      this.xVel *= -0.4;
      this.yVel *= 0.4;
    }
    if (this.xPos > Manager.width - 8) {
      this.xPos = Manager.width - 8;
      this.xVel *= -0.4;
      this.yVel *= 0.4;
    }
    if (this.yPos < 8) {
      this.yPos = 8;
      this.xVel *= 0.4;
      this.yVel *= -0.4;
    }
    if (this.yPos > Manager.height - 8) {
      this.yPos = Manager.height - 8;
      this.xVel *= 0.4;
      this.yVel *= -0.4;
    }

    if (this.invincibleTime < Date.now()) {
      //Check for collisions
      objects.forEach((obj) => {
        if (
          distancebetweenPoints(this.xPos, this.yPos, obj.xPos, obj.yPos) <
          obj.radius + this.SHIP_SIZE / 2
        ) {
          //Ship has hit an object
          this.dead = true;
          this.deathTime = Date.now();
          this.sprite.gotoAndPlay(2);
          this.xVel = 0;
          this.yVel = 0;
        }
      });
    }

    if (!this.sprite.playing) {
      this.setShipFrame();
    }

    if (this.shield) {
      const invincibilityLeft = this.invincibleTime - Date.now();
      if (invincibilityLeft > 0) {
        this.shield.alpha = invincibilityLeft / 3000;
      } else {
        this.sprite.removeChild(this.shield);
        this.shield.destroy();
        this.shield = undefined;
      }
    }

    // Change position by velocity
    this.xPos += this.xVel * framesPassed;
    this.yPos += this.yVel * framesPassed;

    // Update sprite position
    this.sprite.x = this.xPos;
    this.sprite.y = this.yPos;
  }

  private handleDead() {
    if (Date.now() - this.deathTime < 1000) {
      return;
    }
    this.xPos = 100;
    this.yPos = 100;
    this.sprite.x = this.xPos;
    this.sprite.y = this.yPos;
    this.dead = false;
    this.setShipFrame();
    this.invincibleTime = Date.now() + 3000;

    this.shield = Sprite.from("shield");
    this.shield.anchor.set(0.5);
    this.shield.width = this.SHIP_SIZE * 2.4;
    this.shield.height = this.SHIP_SIZE * 2.4;
    this.sprite.addChild(this.shield);
  }

  private setShipFrame(): void {
    if (Keyboard.state.get("ArrowUp")) {
      this.sprite.gotoAndStop(2);
    } else {
      this.sprite.gotoAndStop(1);
    }
  }
}
