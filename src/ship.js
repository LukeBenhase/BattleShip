class Ship {
  constructor(size, number) {
    this.size = size;
    this.hits = 0;
    this.number = number;
  }
  hit() {
    this.hits += 1;
    return;
  }
  isSunk() {
    if (this.hits >= this.size) {
      return true;
    }
    return false;
  }
}

export default Ship;
