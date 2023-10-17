import { BLOCK_SIZE, SHAPES, COLORS, COLS, ROWS, PADDING } from "../constants";

export default class Tetromino {
  variant = Math.floor(Math.random() * SHAPES.length);
  rotation = Math.floor(Math.random() * SHAPES[this.variant].length);
  shape: number[][] = SHAPES[this.variant][this.rotation];
  col = Math.floor(Math.random() * (COLS - this.shape[0].length + 1));
  row = 0;

  checkRotationCollission = (rotation: number, matrix: number[][]) => {
    const rotatedShape = SHAPES[this.variant][rotation];
    for (let row = 0; row < rotatedShape.length; row++)
      for (let col = 0; col < rotatedShape[row].length; col++) {
        const { abslouteRow, abslouteCol } = this.getAbsloutePosition(row, col);
        if (abslouteCol >= COLS || abslouteRow >= ROWS || matrix[abslouteRow][abslouteCol]) return true;
      }
    return false;
  };

  rotateLeft = (matrix: number[][]) => {
    const nextRotation = this.rotation - 1 < 0 ? SHAPES[this.variant].length - 1 : this.rotation - 1;
    if (this.checkRotationCollission(nextRotation, matrix)) return;
    this.rotation = nextRotation;
    this.shape = SHAPES[this.variant][nextRotation];
  };
  rotateRight = (matrix: number[][]) => {
    const nextRotation = this.rotation + 2 > SHAPES[this.variant].length ? 0 : this.rotation + 1;
    if (this.checkRotationCollission(nextRotation, matrix)) return;
    this.rotation = nextRotation;
    this.shape = SHAPES[this.variant][nextRotation];
  };

  moveLeft = (matrix: number[][]) => {
    if (!this.checkCollission(matrix, 0, -1)) this.col--;
  };

  moveRight = (matrix: number[][]) => {
    if (!this.checkCollission(matrix, 0, 1)) this.col++;
  };

  moveDown = (matrix: number[][]) => {
    if (!this.checkCollission(matrix, 1, 0)) this.row++;
  };

  getAbsloutePosition = (row: number, col: number) => {
    return {
      abslouteRow: this.row + row,
      abslouteCol: this.col + col,
    };
  };

  checkCollission = (matrix: number[][], rowOffset: number, colOffset: number) => {
    for (let row = 0; row < this.shape.length; row++)
      for (let col = 0; col < this.shape[row].length; col++) {
        if (!this.shape[row][col]) continue;
        const { abslouteRow, abslouteCol } = this.getAbsloutePosition(row + rowOffset, col + colOffset);
        if (abslouteRow >= ROWS || abslouteCol >= COLS || abslouteCol < 0 || matrix[abslouteRow][abslouteCol] !== 0)
          return true;
      }
    return false;
  };

  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = COLORS[this.variant];
    for (let row = 0; row < this.shape.length; row++) {
      for (let col = 0; col < this.shape[row].length; col++) {
        if (!this.shape[row][col]) continue;
        const { abslouteRow, abslouteCol } = this.getAbsloutePosition(row, col);
        const x = PADDING + abslouteCol * BLOCK_SIZE;
        const y = PADDING + abslouteRow * BLOCK_SIZE;
        ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  };
}
