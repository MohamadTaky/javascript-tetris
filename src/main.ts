import Board from "@/classes/Board";
import CurrentScore from "@/classes/CurrentScore";
import EndGameMenu from "@/classes/EndGameMenu";
import GameLoop from "@/classes/GameLoop";
import MainMenu from "@/classes/MainMenu";
import Tetromino from "@/classes/Tetromino";
import "@/style.css";
import InputHandler from "./classes/InputHandler";
import { HEIGHT, SCORE_TABLE, WIDTH } from "@/constants";

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;
canvas.width = WIDTH;
canvas.height = HEIGHT;

let gameLoop: GameLoop | null = null;
const inputHandler = new InputHandler();
const board = new Board();
let currentTetromino = new Tetromino();
let currentScore = new CurrentScore();
let mainMenu = new MainMenu();
let endGameMenu = new EndGameMenu();

let updateRate = 450;
let accumulatedUpdateTime = 0;
function update(deltaTime: number) {
  accumulatedUpdateTime += deltaTime;
  while (accumulatedUpdateTime > updateRate) {
    accumulatedUpdateTime -= updateRate;
    if (currentTetromino.checkCollission(board.matrix, 0, 0)) {
      gameLoop?.stop();
      endGameMenu.scoreCounter.textContent = currentScore.score.toString();
      endGameMenu.menu.classList.remove("hidden");
    }
    if (currentTetromino.checkCollission(board.matrix, 1, 0)) {
      board.apply(currentTetromino);
      const clearedRows = board.clearFullRows() as keyof typeof SCORE_TABLE;
      if (clearedRows) currentScore.addScore(SCORE_TABLE[clearedRows]);
      currentTetromino = new Tetromino();
    } else currentTetromino.moveDown(board.matrix);
  }

  board.draw(ctx);
  currentTetromino.draw(ctx, board.matrix);
}

inputHandler.inputEvents.moveLeft.addCallback(() => currentTetromino.moveLeft(board.matrix));
inputHandler.inputEvents.moveRight.addCallback(() => currentTetromino.moveRight(board.matrix));
inputHandler.inputEvents.moveDown.addCallback(() => currentTetromino.moveDown(board.matrix));
inputHandler.inputEvents.rotateLeft.addCallback(() => currentTetromino.rotateLeft(board.matrix));
inputHandler.inputEvents.rotateRight.addCallback(() => currentTetromino.rotateRight(board.matrix));

function initGameStates() {
  endGameMenu.menu.classList.add("hidden");
  mainMenu.menu.classList.add("hidden");
  currentScore.reset();
  accumulatedUpdateTime = 0;
  currentTetromino = new Tetromino();
  board.reset();
  gameLoop = new GameLoop(update);
}

mainMenu.playEvent.addCallback(initGameStates);
endGameMenu.playAgainEvent.addCallback(initGameStates);
