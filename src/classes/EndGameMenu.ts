import Event from "@/classes/Event";

export default class EndGameMenu {
  menu = document.getElementById("endGameMenu")!;
  playAgainButton = document.getElementById("playAgainButton")!;
  scoreCounter = document.getElementById("endGameScoreCounter")!;
  playAgainEvent = new Event();
  constructor() {
    this.playAgainButton.addEventListener("click", this.playAgainEvent.fire);
  }
}
