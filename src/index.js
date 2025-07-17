import Gameboard from "./gameboard";
import "./styles.css";

class Player {
  constructor() {
    this.gameboard = new Gameboard();
  }
}

class GameController {
  constructor() {
    this.player1 = new Player();
    this.player2 = new Player();
    this.currentState = "placingShips"; // can be 'placingShips', 'attacking'
  }

  startGame() {
    // Initialize game logic here
    console.log("Game started!");
    // only start game if all ships are placed
    const shipInputs = document.querySelectorAll('input[name="ship"]');
    this.currentState = "attacking"; // Change state to attacking after placing ships
    shipInputs.forEach((input) => {
      if (input.disabled == false) {
        this.currentState = "placingShips"; // Change state to placingShips if any ship is not placed
      }
    });
    if (this.currentState === "placingShips") {
      return;
    }

    this.updateScreen();
    // hide the ship placement controls
    document.getElementById("controls").style.display = "none";

    // generate the computer's gameboard
    for (let i = 0; i < this.player2.gameboard.ships.length; i++) {
      // try locations until the ship is placed
      let placed = false;
      while (!placed) {
        // generate random coordinates
        const randomRow = Math.floor(Math.random() * 10);
        const randomCol = Math.floor(Math.random() * 10);
        const randomDirection = Math.random() < 0.5 ? "horizontal" : "vertical";
        placed = this.player2.gameboard.placeShip(i, randomDirection, [
          randomRow,
          randomCol,
        ]);
      }
    }
    // update screen to see if ships were placed
    this.updateScreen();
  }

  updateScreen() {
    // fill in the boards for both players
    const player1Gameboard = document.getElementById("board-player");
    const player2Gameboard = document.getElementById("board-computer");
    player1Gameboard.innerHTML = "";
    player2Gameboard.innerHTML = "";

    for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 11; j++) {
        // create a cell element for player and computer
        const cellPlayer = document.createElement("button");
        const cellComputer = document.createElement("button");
        cellPlayer.classList.add("cell");
        cellComputer.classList.add("cell");

        // make the cell empty if it is the bottom left corner
        if (i === 10 && j === 0) {
          cellPlayer.classList.add("letters");
          player2Gameboard.appendChild(cellPlayer);
          cellComputer.classList.add("letters");
          player1Gameboard.appendChild(cellComputer);
        }
        // write out the letters at the bottom of the gameboards
        else if (i === 10 && j > 0) {
          cellPlayer.classList.add("letters");
          cellComputer.classList.add("letters");
          cellPlayer.textContent = String.fromCharCode(64 + j);
          cellComputer.textContent = String.fromCharCode(64 + j);
          player2Gameboard.appendChild(cellPlayer);
          player1Gameboard.appendChild(cellComputer);
        }
        // write out the numbers at the left of the gameboards
        else if (j === 0 && i < 10) {
          cellPlayer.classList.add("numbers");
          cellComputer.classList.add("numbers");
          cellPlayer.textContent = 10 - i;
          cellComputer.textContent = 10 - i;
          player2Gameboard.appendChild(cellPlayer);
          player1Gameboard.appendChild(cellComputer);
        }
        // for the internal cells
        else {
          cellPlayer.textContent = "";
          cellComputer.textContent = "";

          // show what is on the gameboards
          if (this.player2.gameboard.board[j - 1][9 - i] === "HIT") {
            cellComputer.classList.add("hit");
          }
          if (
            this.player2.gameboard.missedShots.includes(
              [j - 1, 9 - i].toString()
            )
          ) {
            cellComputer.classList.add("miss");
          }

          if (this.player1.gameboard.board[j - 1][9 - i] != null) {
            cellPlayer.classList.add("ship");
          }
          if (this.player1.gameboard.board[j - 1][9 - i] === "HIT") {
            cellPlayer.classList.add("hit");
          }
          if (
            this.player1.gameboard.missedShots.includes(
              [j - 1, 9 - i].toString()
            )
          ) {
            cellPlayer.classList.add("miss");
          }

          // add event listeners for player to place ships
          if (this.currentState === "placingShips") {
            // try to place selected ship here
            cellPlayer.addEventListener("click", () => {
              this.placeShip([j - 1, 9 - i]);
            });
          }
          // add event listeners for player to attack
          if (this.currentState === "attacking") {
            // only add the event listener if the cell is empty
            if (
              this.player2.gameboard.board[j - 1][9 - i] === "HIT" ||
              this.player2.gameboard.missedShots.includes(
                [j - 1, 9 - i].toString()
              )
            ) {
              // don't allow attack on already hit or missed cells
            } else {
              // try to attack here
              cellComputer.addEventListener("click", () => {
                this.player2.gameboard.receiveAttack([j - 1, 9 - i]);
                this.updateScreen();
                // check if the game is over
                if (
                  !this.player2.gameboard.isShipsLeft() &&
                  this.currentState === "attacking"
                ) {
                  alert("You win!");
                  // refresh the page
                  window.location.reload();
                  this.currentState = "gameOver";
                } else {
                  // switch to computer's turn
                  let shot = false;
                  while (!shot) {
                    // generate random coordinates
                    const randomRow = Math.floor(Math.random() * 10);
                    const randomCol = Math.floor(Math.random() * 10);
                    shot = this.player1.gameboard.receiveAttack([
                      randomRow,
                      randomCol,
                    ]);
                  }
                  this.updateScreen();
                  // check if the game is over
                  if (
                    !this.player1.gameboard.isShipsLeft() &&
                    this.currentState === "attacking"
                  ) {
                    alert("You lose!");
                    this.currentState = "gameOver";
                  }
                }
              });
            }
          }

          player1Gameboard.appendChild(cellPlayer);
          player2Gameboard.appendChild(cellComputer);
        }
      }
    }
  }

  placeShip(coordinates) {
    // get the values of the ship being placed and the direction
    const selectedShip = document.querySelector('input[name="ship"]:checked');
    const shipDirection = document.getElementById("rotate-button").value;
    const shipInputs = document.querySelectorAll('input[name="ship"]');

    // if clicking on ship that is already placed, remove it
    if (
      gameController.player1.gameboard.board[coordinates[0]][coordinates[1]] !=
      null
    ) {
      // if removing a ship, re-enable the input
      // update the controlls to only allow one of each ship
      shipInputs.forEach((input) => {
        if (
          input.value ==
          gameController.player1.gameboard.board[coordinates[0]][coordinates[1]]
            .number
        ) {
          input.disabled = false;
          input.checked = true; // make sure the input is checked
        }
      });
      // then remove the ship from the gameboard
      gameController.player1.gameboard.removePiece(
        gameController.player1.gameboard.board[coordinates[0]][coordinates[1]]
          .number
      );
    } else {
      // place the ship on the gameboard if space for ship.
      if (selectedShip === null || selectedShip.disabled) {
        return;
      }
      if (
        gameController.player1.gameboard.placeShip(
          selectedShip.value,
          shipDirection,
          coordinates
        )
      ) {
        // update the controlls to only allow one of each ship
        shipInputs.forEach((input) => {
          if (input.value === selectedShip.value) {
            input.disabled = true;
          }
          // make another ship selected
          if (!input.disabled) {
            input.checked = true;
          }
        });
      }
    }

    // update the screen
    gameController.updateScreen();
  }
}

// get the rotate button
const rotateButton = document.getElementById("rotate-button");

const gameController = new GameController();
gameController.updateScreen();

// Add event listeners to the cells for player actions
document.getElementById("start-button").addEventListener("click", () => {
  gameController.startGame();
});
rotateButton.addEventListener("click", () => {
  if (rotateButton.value === "horizontal") {
    rotateButton.value = "vertical";
    rotateButton.innerHTML = "Vertical";
  } else {
    rotateButton.value = "horizontal";
    rotateButton.innerHTML = "Horizontal";
  }
});
