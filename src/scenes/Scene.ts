// import { AnimatedSprite, Container, Texture, TextureSource } from "pixi.js";

// export class Scene extends Container {
//   constructor() {
//     super();

//     // This is an array of strings, we need an array of Texture
//     const clampyFrames: Array<TextureSource> = [
//       "one.jpg",
//       "two.jpg",
//       "three.jpg",
//     ];

//     // `array.map()` creates an array from another array by doing something to each element.
//     // `(stringy) => Texture.from(stringy)` means
//     // "A function that takes a string and returns a Texture.from(that String)"
//     const animatedClampy: AnimatedSprite = new AnimatedSprite(
//       clampyFrames.map((stringy) => {
//         return { texture: Texture.from(stringy), time: 100 };
//       })
//     );
//     // (if this javascript is too much, you can do a simple for loop and create a new array with Texture.from())

//     this.addChild(animatedClampy); // we just add it to the scene

//     animatedClampy.play();

//     // Now... what did we learn about assigning functions...
//     animatedClampy.onFrameChange = this.onClampyFrameChange.bind(this);
//   }

//   private onClampyFrameChange(currentFrame: number): void {
//     console.log("Clampy's current frame is", currentFrame);
//   }
// }
