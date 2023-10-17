export default class InputHandler {
  left = false;
  right = false;
  down = false;
  rotateLeft = false;
  rotateRight = false;

  constructor() {
    document.addEventListener("keydown", this.handleInput);
    document.addEventListener("keyup", this.handleInput);
  }

  handleInput = (event: KeyboardEvent) => {
    switch (event.code) {
      case "KeyA":
      case "ArrowLeft":
        this.left = event.type === "keydown" ? true : false;
        break;
      case "KeyD":
      case "ArrowRight":
        this.right = event.type === "keydown" ? true : false;
        break;
      case "KeyS":
      case "ArrowDown":
        this.down = event.type === "keydown" ? true : false;
        break;
      case "KeyQ":
        this.rotateLeft = event.type === "keydown" ? true : false;
        break;
      case "KeyE":
        this.rotateRight = event.type === "keydown" ? true : false;
        break;
    }
  };
}
