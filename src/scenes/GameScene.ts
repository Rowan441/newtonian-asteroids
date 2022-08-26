import { Container, Point, Sprite } from "pixi.js";
import { Planet } from "../objects/planet";
import { Ship } from "../objects/Ship";
import { Keyboard } from "../recipes/Keyboard";
import { IScene, Manager } from "../recipes/Manager";
import { distancebetweenPoints } from "../util";

export class GameScene extends Container implements IScene {
  private objects: Planet[] = [];
  private ship: Ship;
  private sun: Planet;

  private timeToNextPlanetSpawn = Date.now() + 6000;
  private planetsSpawned = 0;

  constructor() {
    super();

    Keyboard.initialize();

    this.ship = new Ship(100, 100, Math.PI);
    this.addChild(this.ship.sprite);

    //Sun
    this.sun = new Planet(Manager.width / 2, Manager.height / 2, 20, 600);
    this.sun.xVel = 0;
    this.sun.yVel = 0;
    this.sun.movable = false;
    this.objects.push(this.sun);

    this.objects.push(new Planet(120, 200, 10, 15));
    this.objects[1].xVel = 0.2;
    this.objects[1].yVel = 1.5;

    this.objects.forEach((obj) => {
      this.addChild(obj.sprite);
    });
  }

  public update(framesPassed: number): void {
    if (Date.now() > this.timeToNextPlanetSpawn) {
      const spawnInterval = Math.max(
        700,
        8000 / (1 + Math.pow(Math.E, 0.03 * (this.planetsSpawned - 20)))
      );
      this.timeToNextPlanetSpawn = Date.now() + spawnInterval;

      let x;
      let y;
      let xVelocity;
      let yVelocity;

      if (Math.random() > 0.5) {
        x = Math.random() * Manager.width;
        if (Math.random() > 0.5) {
          y = -50;
        } else {
          y = Manager.height + 50;
        }
        xVelocity = Math.random() * 1 + 0.5;
        yVelocity = Math.random() * 0.2 - 0.1;
      } else {
        y = Math.random() * Manager.height;
        if (Math.random() > 0.5) {
          x = -50;
        } else {
          x = Manager.width + 50;
        }
        yVelocity = Math.random() * 1 + 0.5;
        xVelocity = Math.random() * 0.2 - 0.1;
      }

      this.planetsSpawned++;
      const newPlanet = new Planet(x, y, Math.random() * 10 + 5, 15);
      this.objects.push(newPlanet);
      this.objects[this.objects.length - 1].xVel = xVelocity;
      this.objects[this.objects.length - 1].yVel = yVelocity;

      this.addChild(newPlanet.sprite);
    }

    let survivingPlanets: Planet[] = [...this.objects];
    this.objects.forEach((obj) => {
      obj.update(framesPassed, this.objects);

      if (obj.isOffScreen()) {
        const { point, angle } = this.getClosestPositionAndAngleToBorder(obj);
        const arrowSize = Math.min(
          25,
          Math.max(
            5,
            25 -
              distancebetweenPoints(obj.xPos, obj.yPos, point.x, point.y) / 10
          )
        );
        if (!obj.arrow) {
          obj.arrow = Sprite.from("offscreen_arrow");
          obj.arrow.anchor.set(0.5);

          this.addChild(obj.arrow);
        }

        obj.arrow.x = point.x;
        obj.arrow.y = point.y;
        obj.arrow.rotation = angle;
        obj.arrow.width = arrowSize;
        obj.arrow.height = arrowSize;
      } else if (obj.arrow) {
        obj.arrow.destroy();
        obj.arrow = undefined;
      }

      if (obj.id !== this.sun.id) {
        const distToSun = distancebetweenPoints(
          this.sun.xPos,
          this.sun.yPos,
          obj.xPos,
          obj.yPos
        );
        if (distToSun < obj.radius + this.sun.radius) {
          obj.explode();
          survivingPlanets = survivingPlanets.filter(
            (planet) => planet.id !== obj.id
          );
        } else if (distToSun > Manager.width * 1.5) {
          // Despawn planets too far off screen
          obj.sprite.destroy();
          if (obj.arrow) {
            obj.arrow.destroy();
            obj.arrow = undefined;
          }
          survivingPlanets = survivingPlanets.filter(
            (planet) => planet.id !== obj.id
          );
        }
      }
    });

    this.objects = survivingPlanets;

    this.ship.update(framesPassed, this.objects);

    if (Keyboard.state.get("Space")) {
      const size = Math.random() * 10 + 5;
      this.objects.unshift(
        new Planet(
          Math.random() * 300 + 100,
          Math.random() * 300 + 100,
          size,
          (size ^ 2) * 0.5
        )
      );
      this.objects[0].xVel = Math.random() * 4 - 2;
      this.objects[0].yVel = Math.random() * 4 - 2;
      this.objects[0].update(framesPassed, this.objects);

      this.addChild(this.objects[0].sprite);
    }
  }

  private getClosestPositionAndAngleToBorder(obj: Planet): {
    point: Point;
    angle: number;
  } {
    let angleSet = false;
    let angle = (3 * Math.PI) / 2;
    let xBorder: number = obj.xPos;
    let yBorder: number = obj.yPos;

    if (obj.xPos < 20) {
      xBorder = 20;
      angleSet = true;
    }
    if (obj.xPos > Manager.width - 20) {
      xBorder = Manager.width - 20;
      angle = Math.PI / 2;
      angleSet = true;
    }
    if (obj.yPos < 20) {
      yBorder = 20;
      if (angleSet) {
        angle =
          Math.atan2(yBorder - obj.yPos, xBorder - obj.xPos) - Math.PI / 2;
      } else {
        angle = 2 * Math.PI;
      }
    }
    if (obj.yPos > Manager.height - 20) {
      yBorder = Manager.height - 20;
      if (angleSet) {
        angle =
          Math.atan2(yBorder - obj.yPos, xBorder - obj.xPos) - Math.PI / 2;
      } else {
        angle = Math.PI;
      }
    }

    return { point: new Point(xBorder, yBorder), angle: angle };
  }
}
