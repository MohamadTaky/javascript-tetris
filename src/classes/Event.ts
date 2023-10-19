export default class Event {
  callbacks: Function[] = [];
  addCallback = (callback: Function) => {
    this.callbacks.push(callback);
  };
  removeCallback = (callback: Function) => {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) this.callbacks.splice(index, 1);
  };
  fire = () => {
    this.callbacks.forEach((callback) => callback());
  };
}
