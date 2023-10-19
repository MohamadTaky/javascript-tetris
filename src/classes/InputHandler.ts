import Event from "./Event";

export default class InputHandler {
  touchStart = { x: 0, y: 0 };
  touchDrag = { x: 0, y: 0 };
  inputRate = 100;
  rotationDir = 0;
  moveDownEvent = new Event();
  inputEvents: Map<string, Event> = new Map();
  inputIntervals: Map<string, number> = new Map();
  moveLeftEvent = new Event();
  moveRightEvent = new Event();
  rotateLeftEvent = new Event();
  rotateRightEvent = new Event();

  constructor() {
    document.addEventListener("keydown", this.handleInput);
    document.addEventListener("keyup", this.handleInput);
    document.addEventListener("touchstart", this.handleTouchStart);
    document.addEventListener("touchmove", this.handleTouchMove);
    document.addEventListener("touchend", this.handleTouchEnd);

    this.inputEvents.set("moveLeft", new Event());
    this.inputEvents.set("moveRight", new Event());
    this.inputEvents.set("moveDown", new Event());
    this.inputEvents.set("rotateLeft", new Event());
    this.inputEvents.set("rotateRight", new Event());
  }

  handleInput = (event: KeyboardEvent) => {
    switch (event.code) {
      case "KeyA":
      case "ArrowLeft":
        this.handleKey(event, "moveLeft");
        break;
      case "KeyD":
      case "ArrowRight":
        this.handleKey(event, "moveRight");
        break;
      case "KeyS":
      case "ArrowDown":
        this.handleKey(event, "moveDown");
        break;
      case "KeyQ":
        this.handleKey(event, "rotateLeft");
        break;
      case "KeyE":
        this.handleKey(event, "rotateRight");
        break;
    }
  };

  handleKey = (event: KeyboardEvent, code: string) => {
    if (event.type === "keydown" && !this.inputIntervals.has(code)) {
      if (!this.inputEvents.has(code)) throw Error(`${code} input event is not defined`);
      const inputEvent = this.inputEvents.get(code) as Event;
      inputEvent.fire();
      this.inputIntervals.set(code, setInterval(inputEvent.fire, this.inputRate));
    } else if (event.type === "keyup" && this.inputIntervals.has(code)) {
      clearInterval(this.inputIntervals.get(code));
      this.inputIntervals.delete(code);
    }
  };

  handleTouchStart = (event: TouchEvent) => {
    if (!event.touches) return;
    this.touchStart.x = event.touches[0].pageX;
    this.touchStart.y = event.touches[0].pageY;
  };
  handleTouchMove = (event: TouchEvent) => {
    if (!event.touches) return;
    const deltaX = event.touches[0].pageX - this.touchDrag.x;
    const deltaY = event.touches[0].pageY - this.touchDrag.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > 20) {
      if (deltaX > 0) this.inputEvents.get("moveRight")?.fire();
      else this.inputEvents.get("moveLeft")?.fire();
      this.touchDrag.x = event.touches[0].pageX;
    }
    if (absDeltaY > 20) {
      if (deltaY > 0) this.inputEvents.get("moveDown")?.fire();
      this.touchDrag.y = event.touches[0].pageY;
    }
  };

  handleTouchEnd = (event: TouchEvent) => {
    if (!event.changedTouches) return;
    const deltaX = event.changedTouches[0].pageX - this.touchStart.x;
    const deltaY = event.changedTouches[0].pageX - this.touchStart.x;
    if (Math.hypot(deltaX, deltaY) < 10) {
      const touchRelativeToScrrenCenter = event.changedTouches[0].pageX - document.body.clientWidth * 0.5;
      if (touchRelativeToScrrenCenter > 0) this.inputEvents.get("rotateRight")?.fire();
      else this.inputEvents.get("rotateLeft")?.fire();
    }
  };
}
