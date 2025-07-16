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
  }

  updateScreen() {
    // fill in the boards for both players
    const player1Gameboard = document.getElementById("board-player");
    const player2Gameboard = document.getElementById("board-computer");
    player1Gameboard.innerHTML = "";
    player2Gameboard.innerHTML = "";

    for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 11; j++) {
        const cellElement = document.createElement("button");
        cellElement.classList.add("cell");
        if (i === 10 && j === 0) {
          cellElement.classList.add("letters");
          player2Gameboard.appendChild(cellElement.cloneNode());
        } else if (i === 10 && j > 0) {
          cellElement.classList.add("letters");
          cellElement.textContent = String.fromCharCode(64 + j);
          player2Gameboard.appendChild(cellElement.cloneNode(true));
        } else if (j === 0 && i < 10) {
          cellElement.classList.add("numbers");
          cellElement.textContent = 10 - i;
          player2Gameboard.appendChild(cellElement.cloneNode(true));
        } else {
          cellElement.textContent = `${j - 1}${9 - i}` || "";
          if (this.player1.gameboard.board[j - 1][9 - i] != null) {
            cellElement.classList.add("ship");
          }

          if (this.currentState === "placingShips") {
            // try to place selected ship here
            cellElement.addEventListener("click", () => {
              this.placeShip([j - 1, 9 - i]);
            });
          }

          player2Gameboard.appendChild(cellElement.cloneNode());
        }
        player1Gameboard.appendChild(cellElement);
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
      gameController.player1.gameboard.placeShip(
        selectedShip.value,
        shipDirection,
        coordinates
      );
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

    // update the screen
    gameController.updateScreen();
  }
}

// get the rotate button
const rotateButton = document.getElementById("rotate-button");

let gameController = new GameController();
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
