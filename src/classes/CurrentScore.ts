export default class CurrentScore {
  score = 0;
  currentScoreCounter = document.getElementById("gameScoreCounter")!;

  addScore = (amount: number) => {
    this.score += amount;
    this.currentScoreCounter.textContent = this.score.toString();
  };

  reset = () => {
    this.score = 0;
    this.currentScoreCounter.textContent = this.score.toString();
  };
}
