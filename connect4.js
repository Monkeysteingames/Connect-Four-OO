/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(HEIGHT, WIDTH, player1, player2) {
    this.players = [player1, player2];
    this.currPlayer = player1;
    this.board = [];
    this.HEIGHT = HEIGHT;
    this.WIDTH = WIDTH;
    //execute the starting methods to start the game
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');
    const startGameBtn = document.getElementById('start-game-btn');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    //bind 'this' to the event listener for methods within the instance
    this.boundHandleClick = this.handleClick.bind(this);
    this.toggleGameState = this.toggleGameState.bind(this);

    top.addEventListener('click', this.boundHandleClick);
    startGameBtn.addEventListener('click', this.toggleGameState);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  handleClick(evt) {
    // get x from ID of clicked cell
    if (this.gameOver == true) {
      return;
    }
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }


  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.top = -50 * (y + 2);
    piece.style.backgroundColor = this.currPlayer.color;

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  checkForWin() {
    const gameInstance = this;
    function _win(cells, gameInstance) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < gameInstance.HEIGHT &&
          x >= 0 &&
          x < gameInstance.WIDTH &&
          gameInstance.board[y][x] === gameInstance.currPlayer
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz, gameInstance) || _win(vert, gameInstance) || _win(diagDR, gameInstance) || _win(diagDL, gameInstance)) {
          return true;
        }
      }
    }
  }

  endGame(msg) {
    alert(msg);
    this.gameOver = true;
  }

  toggleGameState() {
    if (this.gameOver == true) {
      //start game over again
      this.gameOver = false;
      const startGameBtn = document.getElementById('start-game-btn');
      startGameBtn.innerText = 'Stop Game';
    } else {
      //end game - clear board and reset variables (basically redo the constructor)
      let player1 = new Player(document.getElementById('player1-color').value);
      let player2 = new Player(document.getElementById('player2-color').value);
      this.gameOver = true;
      this.board = [];
      this.players = [player1, player2];
      this.currPlayer = player1;
      const htmlBoard = document.querySelector("#board")
      this.removeAllChildNodes(htmlBoard);
      this.makeBoard();
      this.makeHtmlBoard();
      const startGameBtn = document.getElementById('start-game-btn');
      startGameBtn.innerText = 'Start Game';
    }
  }

  removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

}

class Player {
  constructor(color) {
    this.color = color;
  }
}

let player1 = new Player(document.getElementById('player1-color').value);
let player2 = new Player(document.getElementById('player2-color').value);

new Game(6, 7, player1, player2);
