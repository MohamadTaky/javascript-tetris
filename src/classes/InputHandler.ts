import Event from "./Event";

export default class InputHandler {
  touchStart = { x: 0, y: 0 };
  touchDrag = { x: 0, y: 0 };
  inputRate = 70;
  keys = {
    rotateLeft: false,
    rotateRight: false,
  };
  events = {
    moveLeft: new Event(),
    moveRight: new Event(),
    moveDown: new Event(),
    rotateLeft: new Event(),
    rotateRight: new Event(),
  };
  intervals = {
    moveLeft: 0,
    moveRight: 0,
    moveDown: 0,
    rotateLeft: 0,
    rotateRight: 0,
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
        this.handleSingleKey(event, "rotateRight");
        break;
      case "KeyE":
        this.handleSingleKey(event, "rotateLeft");
        break;
    }
  };
  handleKey = (event: KeyboardEvent, code: keyof typeof this.events) => {
    if (event.type === "keydown" && !this.intervals[code]) {
      this.events[code].fire();
      this.intervals[code] = setInterval(this.events[code].fire, this.inputRate);
    } else if (event.type === "keyup" && this.intervals[code]) {
      clearInterval(this.intervals[code]);
      this.intervals[code] = 0;
    }
  };
  handleSingleKey = (event: KeyboardEvent, key: keyof typeof this.keys) => {
    if (event.type === "keydown" && !this.keys[key]) {
      this.keys[key] = true;
      this.events[key].fire();
    } else if (event.type === "keyup" && this.keys[key]) this.keys[key] = false;
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
      if (deltaX > 0) this.events.moveRight.fire();
      else this.events.moveLeft.fire();
      this.touchDrag.x = event.touches[0].pageX;
    }

    if (Math.abs(deltaY) > 60) {
      if (deltaY > 0 && !this.intervals.moveDown)
        this.intervals.moveDown = setInterval(this.events.moveDown.fire, this.inputRate);
      else if (deltaY < 0 && this.intervals.moveDown) {
        clearInterval(this.intervals.moveDown);
        this.intervals.moveDown = 0;
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
      if (touchRelativeToScrrenCenter > 0) this.events.rotateRight.fire();
      else this.events.rotateLeft.fire();
    }
    clearInterval(this.intervals.moveDown);
    this.intervals.moveDown = 0;
  };
}
