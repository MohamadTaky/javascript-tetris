import Board from "@/classes/Board";
import GameLoop from "@/classes/GameLoop";
import Tetromino from "@/classes/Tetromino";
import "@/style.css";
import InputHandler from "./classes/InputHandler";
import { HEIGHT, SCORE_TABLE, WIDTH } from "./constants";

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;
canvas.width = WIDTH;
canvas.height = HEIGHT;

let gameLoop: GameLoop | null = null;
const inputHandler = new InputHandler();
const board = new Board();
let currentTetromino = new Tetromino();

let currentScore = 0;
let gameScoreCounter = document.getElementById("gameScoreCounter")!;

let mainMenu = document.getElementById("mainMenu")!;
let playButton = document.getElementById("playButton")!;
playButton.addEventListener("click", startGameHandler);

let endGameMenu = document.getElementById("endGameMenu")!;
let playAgainButton = document.getElementById("playAgainButton")!;
let endGameScoreCounter = document.getElementById("endGameScoreCounter")!;
playAgainButton.addEventListener("click", restartGameHandler);

function clearedRowsHandler(clearedRows: keyof typeof SCORE_TABLE) {
  currentScore += SCORE_TABLE[clearedRows];
  gameScoreCounter.textContent = currentScore.toString();
}

let rotationRate = 70;
let accumulatedRotationTime = 0;
let moveRate = 100;
let accumulatedMoveTime = 0;
let updateRate = 500;
let accumulatedUpdateTime = 0;
function update(deltaTime: number) {
  accumulatedUpdateTime += deltaTime;
  while (accumulatedUpdateTime > updateRate) {
    accumulatedUpdateTime -= updateRate;
    if (currentTetromino.checkCollission(board.matrix, 0, 0)) endGameHandler();
    if (currentTetromino.checkCollission(board.matrix, 1, 0)) {
      board.apply(currentTetromino);
      const clearedRows = board.clearFullRows() as keyof typeof SCORE_TABLE;
      if (clearedRows) clearedRowsHandler(clearedRows);
      currentTetromino = new Tetromino();
    } else currentTetromino.moveDown(board.matrix);
  }

  accumulatedMoveTime += deltaTime;
  while (accumulatedMoveTime > moveRate) {
    accumulatedMoveTime -= moveRate;
    if (inputHandler.left) currentTetromino.moveLeft(board.matrix);
    if (inputHandler.right) currentTetromino.moveRight(board.matrix);
    if (inputHandler.down) currentTetromino.moveDown(board.matrix);
  }

  accumulatedRotationTime += deltaTime;
  while (accumulatedRotationTime > rotationRate) {
    accumulatedRotationTime -= rotationRate;
    if (inputHandler.rotateLeft) currentTetromino.rotateLeft(board.matrix);
    if (inputHandler.rotateRight) currentTetromino.rotateRight(board.matrix);
  }

  board.draw(ctx);
  currentTetromino.draw(ctx);
}

function endGameHandler() {
  gameLoop?.stop();
  endGameScoreCounter.textContent = currentScore.toString();
  endGameMenu.classList.remove("hidden");
}

function startGameHandler() {
  mainMenu.classList.add("hidden");
  currentScore = 0;
  gameScoreCounter.textContent = currentScore.toString();
  gameLoop = new GameLoop(update);
}

function restartGameHandler() {
  endGameMenu.classList.add("hidden");
  currentScore = 0;
  gameScoreCounter.textContent = currentScore.toString();
  board.reset();
  currentTetromino = new Tetromino();
  accumulatedUpdateTime = 0;
  accumulatedRotationTime = 0;
  accumulatedMoveTime = 0;
  gameLoop = new GameLoop(update);
}
