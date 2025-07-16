import Ship from "./ship";

class Gameboard {
  constructor() {
    this.missedShots = [];
    this.hitShots = [];
    this.board = [];
    // loop through rows
    for (let i = 0; i < 10; i++) {
      let row = [];
      // loop through columns
      for (let j = 0; j < 10; j++) {
        row.push(null);
      }
      this.board.push(row);
    }
    // shipNumber is the array index of the ship
    this.ships = [
      new Ship(2, 0),
      new Ship(3, 1),
      new Ship(3, 2),
      new Ship(4, 3),
      new Ship(5, 4),
    ];
  }

  receiveAttack(coordinates) {
    if (this.board[coordinates[0]][coordinates[1]] != null) {
      // something was hit
      if (this.board[coordinates[0]][coordinates[1]] == "HIT") {
        // something was previously  hit here
        return false;
      }
      console.log(this.board[coordinates[0]][coordinates[1]]);
      //let tempShip = this.board[coordinates[0]][coordinates[1]];
      //tempShip.hit();
      this.board[coordinates[0]][coordinates[1]].hit();
      console.log(this.board[coordinates[0]][coordinates[1]]);

      this.board[coordinates[0]][coordinates[1]] = "HIT";
      return true;
    }
    // the bullet hit the ocean
    if (this.missedShots.includes(coordinates.toString())) return false;

    // add the miss to the list of misses
    this.missedShots.push(coordinates.toString());

    return true;
  }

  // shipNumber is the array index of the ship, direction - horizontal, vertical
  placeShip(shipNumber, direction, coordinates) {
    for (let i = 0; i < this.ships[shipNumber].size; i++) {
      if (direction == "horizontal") {
        // check to see if it goes out of bounds
        if (coordinates[0] + i >= 10) return false;
        // check to see if there is something there
        if (this.board[coordinates[0] + i][coordinates[1]] != null)
          return false;
      } else if (direction == "vertical") {
        if (coordinates[1] + i >= 10) return false;
        if (this.board[coordinates[0]][coordinates[1] + i] != null)
          return false;
      }
    }
    // if it made it through the check above place the ship using a similar loop.

    for (let i = 0; i < this.ships[shipNumber].size; i++) {
      if (direction == "horizontal") {
        // check to see if there is something there
        this.board[coordinates[0] + i][coordinates[1]] = this.ships[shipNumber];
      } else if (direction == "vertical") {
        this.board[coordinates[0]][coordinates[1] + i] = this.ships[shipNumber];
      }
    }
    return true;
  }

  removePiece(shipNumber) {
    // loop through rows
    for (let i = 0; i < 10; i++) {
      // loop through columns
      for (let j = 0; j < 10; j++) {
        if (this.board[i][j] == this.ships[shipNumber]) this.board[i][j] = null;
      }
    }
    return;
  }

  isShipsLeft() {
    // loop through ships asking if any are not sunk
    for (let i = 0; i < this.ships.length; i++) {
      if (!this.ships[i].isSunk()) return true;
    }
    return false;
  }
}

export default Gameboard;
