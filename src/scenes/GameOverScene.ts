import { Container, TextStyle, Text, Graphics } from "pixi.js";
import { IScene, Manager } from "../recipes/Manager";
import { GameScene } from "./GameScene";

export class GameOverScene extends Container implements IScene {
  constructor(survivalTime: number) {
    super();

    const gameOverStyle = new TextStyle({
      align: "center",
      fill: "#fb4b4b",
      fontFamily: "Verdana",
      fontSize: 42,
      fontWeight: "bold",
    });
    const heading = new Container();
    heading.x = Manager.width / 2;
    heading.y = 75;
    const gameOverText = new Text("Game Over!", gameOverStyle);
    gameOverText.anchor.set(0.5);
    this.addChild(heading);
    heading.addChild(gameOverText);

    const finalScoreStyle = new TextStyle({
      align: "center",
      fill: "#fb4b4b",
      fontFamily: "Verdana",
      fontSize: 36,
    });

    const subheading = new Container();
    subheading.x = Manager.width / 2;
    subheading.y = 150;
    const finalScoreText: Text = new Text(
      `You survived: ${survivalTime / 1000} seconds`,
      finalScoreStyle
    );

    finalScoreText.anchor.set(0.5);

    this.addChild(subheading);
    subheading.addChild(finalScoreText);

    const retryStyle = new TextStyle({
      align: "center",
      fill: "#ffffff",
      fontFamily: "Verdana",
      fontSize: 28,
    });

    const retryButton = new Graphics();
    retryButton.beginFill(0x3f51b5);
    retryButton.drawRect(0, 0, 150, 100);
    retryButton.endFill();
    retryButton.interactive = true;
    retryButton.on("pointerdown", this.restartGame);
    retryButton.x = Manager.width / 2 - 75;
    retryButton.y = 350;
    const retryText: Text = new Text(`Retry?`, retryStyle);

    retryText.anchor.set(0.5);
    retryText.x = Manager.width / 2;
    retryText.y = 400;

    this.addChild(retryButton);
    this.addChild(retryText);
  }

  restartGame(): void {
    Manager.changeScene(new GameScene());
  }

  public update(_framesPassed: number): void {}
}
