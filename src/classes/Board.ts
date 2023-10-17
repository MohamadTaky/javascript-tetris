import { ROWS, COLS, BLOCK_SIZE, COLORS, PADDING } from "@/constants";
import Tetromino from "@/classes/Tetromino";

export default class Board {
  matrix = Array.from({ length: ROWS }, (_) => Array(COLS).fill(0));

  draw = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "black";
    this.matrix.forEach((arr, row) =>
      arr.forEach((value, col) => {
        if (value) {
          ctx.fillStyle = COLORS[value - 1];
          ctx.fillRect(PADDING + col * BLOCK_SIZE, PADDING + row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          ctx.strokeRect(PADDING + col * BLOCK_SIZE, PADDING + row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }),
    );
  };

  reset = () => {
    this.matrix = Array.from({ length: ROWS }, (_) => Array(COLS).fill(0));
  };

  apply = (tetromino: Tetromino) => {
    for (let row = 0; row < tetromino.shape.length; row++)
      for (let col = 0; col < tetromino.shape[row].length; col++)
        if (tetromino.shape[row][col]) {
          const { abslouteRow, abslouteCol } = tetromino.getAbsloutePosition(row, col);
          this.matrix[abslouteRow][abslouteCol] = tetromino.shape[row][col];
        }
  };

  clearFullRows = () => {
    let clearedRows = 0;
    let shouldRearrange = false;
    for (let row = 0; row < ROWS; row++) {
      let full = true;
      for (let col = 0; col < COLS; col++)
        if (this.matrix[row][col] === 0) {
          full = false;
          break;
        }
      if (full) {
        this.matrix[row].fill(0);
        clearedRows++;
        shouldRearrange = true;
      }
    }
    if (shouldRearrange) {
      let rowPtr = ROWS - 1;
      for (let row = ROWS - 1; row >= 0; row--) {
        let empty = true;
        for (let col = 0; col < COLS; col++)
          if (this.matrix[row][col]) {
            empty = false;
            break;
          }
        if (!empty) {
          if (row !== rowPtr) {
            this.matrix[rowPtr] = Array.from(this.matrix[row]);
            this.matrix[row].fill(0);
          }
          rowPtr--;
        }
      }
    }
    return clearedRows;
  };
}
