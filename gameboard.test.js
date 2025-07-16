import Gameboard from "./src/gameboard";

describe("Gameboard", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  describe("constructor", () => {
    test("should create a 10x10 board filled with null", () => {
      expect(gameboard.board.length).toBe(10);
      expect(gameboard.board[0].length).toBe(10);
      expect(gameboard.board[0][0]).toBeNull();
      expect(gameboard.board[9][9]).toBeNull();
    });

    test("should initialize 5 ships with correct sizes", () => {
      expect(gameboard.ships.length).toBe(5);
      expect(gameboard.ships[0].size).toBe(2);
      expect(gameboard.ships[1].size).toBe(3);
      expect(gameboard.ships[2].size).toBe(3);
      expect(gameboard.ships[3].size).toBe(4);
      expect(gameboard.ships[4].size).toBe(5);
    });
  });

  describe("placeShip", () => {
    test("should place ship horizontally", () => {
      expect(gameboard.placeShip(0, "horizontal", [0, 0])).toBe(true);
      expect(gameboard.board[0][0]).toBe(gameboard.ships[0]);
      expect(gameboard.board[1][0]).toBe(gameboard.ships[0]);
    });

    test("should place ship vertically", () => {
      expect(gameboard.placeShip(1, "vertical", [2, 2])).toBe(true);
      expect(gameboard.board[2][2]).toBe(gameboard.ships[1]);
      expect(gameboard.board[2][3]).toBe(gameboard.ships[1]);
      expect(gameboard.board[2][4]).toBe(gameboard.ships[1]);
    });

    test("should not place ship out of bounds horizontally", () => {
      expect(gameboard.placeShip(4, "horizontal", [6, 0])).toBe(false);
    });

    test("should not place ship out of bounds vertically", () => {
      expect(gameboard.placeShip(4, "vertical", [0, 6])).toBe(false);
    });

    test("should not place ship on occupied space", () => {
      gameboard.placeShip(0, "horizontal", [0, 0]);
      expect(gameboard.placeShip(1, "horizontal", [0, 0])).toBe(false);
    });
  });

  describe("receiveAttack", () => {
    beforeEach(() => {
      gameboard.placeShip(0, "horizontal", [0, 0]); // size 2 ship
    });

    test("should hit a ship and mark it as HIT", () => {
      expect(gameboard.receiveAttack([0, 0])).toBe(true);
      expect(gameboard.board[0][0]).toBe("HIT");
    });

    test("should not allow hitting same spot twice", () => {
      gameboard.receiveAttack([0, 0]);
      expect(gameboard.receiveAttack([0, 0])).toBe(false);
    });

    test("should record missed shots", () => {
      expect(gameboard.receiveAttack([5, 5])).toBe(true);
      expect(gameboard.missedShots).toContain("5,5");
    });

    test("should not allow missing same spot twice", () => {
      gameboard.receiveAttack([5, 5]);
      expect(gameboard.receiveAttack([5, 5])).toBe(false);
    });

    test("should call hit() on the ship when hit", () => {
      const ship = gameboard.ships[0];
      const initialHits = ship.hits;
      gameboard.receiveAttack([0, 0]);
      expect(ship.hits).toBe(initialHits + 1);
    });
  });

  describe("removePiece", () => {
    test("should remove ship from board", () => {
      gameboard.placeShip(0, "horizontal", [0, 0]);
      gameboard.removePiece(0);
      expect(gameboard.board[0][0]).toBeNull();
      expect(gameboard.board[1][0]).toBeNull();
    });
  });

  describe("isShipsLeft", () => {
    test("should return true when ships are not sunk", () => {
      expect(gameboard.isShipsLeft()).toBe(true);
    });

    test("should return false when all ships are sunk", () => {
      // Manually sink all ships
      gameboard.ships.forEach((ship) => {
        ship.hits = ship.size;
      });
      expect(gameboard.isShipsLeft()).toBe(false);
    });

    test("should return true when some ships are sunk but not all", () => {
      gameboard.ships[0].hits = gameboard.ships[0].size; // sink first ship
      expect(gameboard.isShipsLeft()).toBe(true);
    });
  });

  describe("integration test", () => {
    test("should handle complete game scenario", () => {
      // Place ships
      expect(gameboard.placeShip(0, "horizontal", [0, 0])).toBe(true); // size 2
      expect(gameboard.placeShip(1, "vertical", [2, 2])).toBe(true); // size 3

      // Attack and sink first ship
      expect(gameboard.receiveAttack([0, 0])).toBe(true);
      expect(gameboard.receiveAttack([1, 0])).toBe(true);
      expect(gameboard.ships[0].isSunk()).toBe(true);

      // Ships should still be left
      expect(gameboard.isShipsLeft()).toBe(true);

      // Remove the second ship
      gameboard.removePiece(1);

      // Sink all remaining ships
      gameboard.ships.forEach((ship) => {
        ship.hits = ship.size;
      });

      // Now no ships should be left
      expect(gameboard.isShipsLeft()).toBe(false);
    });
  });
});
