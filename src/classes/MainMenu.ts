import Event from "@/classes/Event";

export default class MainMenu {
  menu = document.getElementById("mainMenu")!;
  playButton = document.getElementById("playButton")!;
  playEvent = new Event();
  constructor() {
    this.playButton.addEventListener("click", this.playEvent.fire);
  }
}
