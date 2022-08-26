import { AnimatedSprite, Sprite, Texture } from "pixi.js";
import { Manager } from "../recipes/Manager";

export class Planet {
  id: string;

  sprite: AnimatedSprite;
  arrow?: Sprite;

  xPos: number;
  yPos: number;
  radius: number;
  mass: number;

  movable = true;

  xVel: number = 0;
  yVel: number = 0;

  constructor(x: number, y: number, radius: number, mass: number) {
    this.id = crypto.randomUUID();

    const planetFrames: Array<Texture> = [
      "planet" + (Math.floor(Math.random() * 4) + 1),
      "explosion1",
      "explosion2",
      "explosion3",
      "explosion4",
      "explosion5",
      "explosion6",
      "explosion7",
      "explosion8",
    ].map((frame) => Texture.from(frame));

    this.sprite = new AnimatedSprite(planetFrames);
    this.sprite.loop = false;
    this.sprite.animationSpeed = 0.3;
    this.sprite.onComplete = (() => {
      this.sprite.destroy();
    }).bind(this);

    this.sprite.anchor.set(0.5);
    this.sprite.width = radius * 2;
    this.sprite.height = radius * 2;

    this.xPos = x;
    this.yPos = y;
    this.radius = radius;
    this.mass = mass;
  }

  public update(framesPassed: number, objects: Planet[]) {
    if (this.movable) {
      // Calculate accelaeration due to gravity from other objects
      let xAccel = 0;
      let yAccel = 0;
      objects.forEach((obj) => {
        if (this.isSelf(obj)) {
          return;
        }
        const distToObjSquared = Math.abs(
          Math.pow(this.xPos - obj.xPos, 2) + Math.pow(this.yPos - obj.yPos, 2)
        );

        if (distToObjSquared > this.radius + obj.radius) {
          const acceleration = obj.mass / distToObjSquared;

          let angletoObj = Math.atan2(
            obj.yPos - this.yPos,
            obj.xPos - this.xPos
          );

          xAccel += acceleration * Math.cos(angletoObj);
          yAccel += acceleration * Math.sin(angletoObj);
        }
      });

      // Change velocity by acceration
      this.xVel += xAccel * framesPassed;
      this.yVel += yAccel * framesPassed;

      // Change position by velocity
      this.xPos += this.xVel * framesPassed;
      this.yPos += this.yVel * framesPassed;
    }

    // Update sprite position
    this.sprite.x = this.xPos;
    this.sprite.y = this.yPos;
  }

  public explode() {
    this.sprite.gotoAndPlay(2);
    this.xVel = 0;
    this.yVel = 0;
  }

  public isOffScreen() {
    if (
      this.xPos < 0 - this.radius ||
      this.xPos > Manager.width + this.radius ||
      this.yPos < 0 - this.radius ||
      this.yPos > Manager.height + this.radius
    ) {
      return true;
    }
    return false;
  }

  private isSelf(obj: Planet) {
    return this.id === obj.id;
  }
}
