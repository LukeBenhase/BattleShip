import Ship from "./src/ship";

test("this tests if the ship sinks when hit.", () => {
  let testShip = new Ship(2);
  testShip.hit();
  expect(testShip.isSunk()).toBe(false);
  testShip.hit();
  expect(testShip.isSunk()).toBe(true);
});
