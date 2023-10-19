import Event from "./Event";

export default class InputHandler {
  touchStart = { x: 0, y: 0 };
  touchDrag = { x: 0, y: 0 };
  inputRate = 70;
  moveDownEvent = new Event();
  inputEvents = {
    moveLeft: new Event(),
    moveRight: new Event(),
    moveDown: new Event(),
    rotateLeft: new Event(),
    rotateRight: new Event(),
  };
  inputIntervals: {
    moveLeft: undefined | number;
    moveRight: undefined | number;
    moveDown: undefined | number;
    rotateLeft: undefined | number;
    rotateRight: undefined | number;
  } = {
    moveLeft: undefined,
    moveRight: undefined,
    moveDown: undefined,
    rotateLeft: undefined,
    rotateRight: undefined,
  };

  constructor() {
    document.addEventListener("keydown", this.handleInput);
    document.addEventListener("keyup", this.handleInput);
    document.addEventListener("touchstart", this.handleTouchStart);
    document.addEventListener("touchmove", this.handleTouchMove);
    document.addEventListener("touchend", this.handleTouchEnd);
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

  handleKey = (event: KeyboardEvent, code: keyof typeof this.inputEvents) => {
    if (event.type === "keydown" && !this.inputIntervals[code]) {
      this.inputEvents[code].fire();
      this.inputIntervals[code] = setInterval(this.inputEvents[code].fire, this.inputRate);
    } else if (event.type === "keyup" && this.inputIntervals[code]) {
      clearInterval(this.inputIntervals[code]);
      this.inputIntervals[code] = undefined;
    }
  };

  handleTouchStart = (event: TouchEvent) => {
    if (!event.touches) return;
    this.touchStart.x = event.touches[0].pageX;
    this.touchStart.y = event.touches[0].pageY;
    this.touchDrag.x = event.touches[0].pageX;
    this.touchDrag.y = event.touches[0].pageY;
  };
  handleTouchMove = (event: TouchEvent) => {
    if (!event.touches) return;
    const deltaX = event.touches[0].pageX - this.touchDrag.x;
    const deltaY = event.touches[0].pageY - this.touchDrag.y;

    if (Math.abs(deltaX) > 30) {
      if (deltaX > 0) this.inputEvents.moveRight.fire();
      else this.inputEvents.moveLeft.fire();
      this.touchDrag.x = event.touches[0].pageX;
    }

    if (Math.abs(deltaY) > 60) {
      if (deltaY > 0 && !this.inputIntervals.moveDown)
        this.inputIntervals.moveDown = setInterval(this.inputEvents.moveDown.fire, this.inputRate);
      else if (deltaY < 0 && this.inputIntervals.moveDown) {
        clearInterval(this.inputIntervals.moveDown);
        this.inputIntervals.moveDown = undefined;
      }
      this.touchDrag.y = event.touches[0].pageY;
    }
  };

  handleTouchEnd = (event: TouchEvent) => {
    if (!event.changedTouches) return;
    const deltaX = event.changedTouches[0].pageX - this.touchStart.x;
    const deltaY = event.changedTouches[0].pageY - this.touchStart.y;
    if (Math.hypot(deltaX, deltaY) < 5) {
      const touchRelativeToScrrenCenter = event.changedTouches[0].pageX - document.body.clientWidth * 0.5;
      if (touchRelativeToScrrenCenter > 0) this.inputEvents.rotateRight.fire();
      else this.inputEvents.rotateLeft.fire();
    }
    clearInterval(this.inputIntervals.moveDown);
    this.inputIntervals.moveDown = undefined;
  };
}
