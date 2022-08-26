import { Manager } from "./recipes/Manager";
import { LoaderScene } from "./scenes/LoaderScene";

Manager.initialize(640, 480, 0x0c0c0c);

// We no longer need to tell the scene the size because we can ask Manager!
const loady: LoaderScene = new LoaderScene();
Manager.changeScene(loady);
