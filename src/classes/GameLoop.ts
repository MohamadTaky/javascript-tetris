export default class GameLoop {
  time = performance.now();
  deltaTime = 0;
  update;
  loopRunning = false;
  constructor(update: (deltaTime: number) => void) {
    this.update = update;
    this.start();
  }
  tick = () => {
    if (!this.loopRunning) return;
    requestAnimationFrame(this.tick);
    this.deltaTime = performance.now() - this.time;
    this.time += this.deltaTime;
    this.update(this.deltaTime);
  };
  start = () => {
    this.loopRunning = true;
    this.tick();
  };
  stop = () => {
    this.loopRunning = false;
  };
}
