const [warehouse, moves] = input.trim().split('\n\n');

const wideWarehouse = warehouse.replace(/O/g, '[]').replace(/\./g, '..').replace(/#/g, '##').replace('@', '@.');

const width = wideWarehouse.indexOf('\n');

const replaceAt = (string, position, chars) => string.slice(0, position) + chars + string.slice(position + chars.length);

// Moving left and right can be done with regexes like in part 1, but moving up
// and down is a bit more complex. There will be functions to specifically move
// boxes up and down. rowDiff is -1 for moving up and 1 for moving down.
const getRobotMover = rowDiff => warehouse => {
  const position = warehouse.indexOf('@');
  const adjacentPosition = position + (width + 1) * rowDiff;
  const adjacentCell = warehouse[adjacentPosition];
  if (adjacentCell === '#') return warehouse;
  // If the adjacent cell is empty, the given warehouse is ready for the move.
  const newWarehouse = adjacentCell === '.' ? warehouse
    // Otherwise, we move the adjacent box.
    // I never use this on my job, but remember that true is converted to 1 and
    // false to 0 (meaning: if the adjacent cell is a ']', there's a box on the
    // adjacent row *and* previous column; otherwise, it's the same column).
    : moveBox[rowDiff](warehouse, adjacentPosition - (adjacentCell === ']'));

  // We check if the adjacent cell in the (eventually updated) warehouse is free.
  return newWarehouse[adjacentPosition] === '.'
    // If it is, we move the robot in the adjacent position.
    ? replaceAt(replaceAt(newWarehouse, position, '.'), adjacentPosition, '@')
    // If we couldn't free the cell above, we return the *original* warehouse
    : warehouse;
};

// This maps a direction to a function that tries to move the robot in that
// direction, returning the (eventually updated) warehouse.
const moveRobot = {
  '^': getRobotMover(-1),
  '>': warehouse => warehouse.replace(/@(?:\[\])*\./, match => '.@' + match.slice(1, -1)),
  'v': getRobotMover(1),
  '<': warehouse => warehouse.replace(/\.(?:\[\])*@/, match => match.slice(1, -1) + '@.')
};

// The position is supposed to point to the *left* part of a box.
const getBoxMover = rowDiff => (warehouse, position) => {
  const adjacentPosition = position + (width + 1) * rowDiff;
  const adjacentCells = warehouse.slice(adjacentPosition, adjacentPosition + 2);
  if (adjacentCells.includes('#')) return warehouse;
  const [left, right] = adjacentCells;
  if (left !== '.') {
    // I never use this on my job, but remember that true is converted to 1 and
    // false to 0 (meaning: it the left cell above is a ']', there's a box on
    // the adjacent row *and* previous column; otherwise, it's the same column).
    warehouse = moveBox[rowDiff](warehouse, adjacentPosition - (left === ']'));
  }
  if (right === '[') {
    warehouse = moveBox[rowDiff](warehouse, adjacentPosition + 1);
  }
  return warehouse.slice(adjacentPosition, adjacentPosition + 2) === '..'
    ? replaceAt(replaceAt(warehouse, position, '..'), adjacentPosition, '[]')
    : warehouse;
};

const moveBox = {
  '-1': getBoxMover(-1),
  '1': getBoxMover(1)
};

const finalWarehouse = moves.split(/\n?/).reduce((warehouse, direction) => moveRobot[direction](warehouse), wideWarehouse);

// Thanks to less leverage on regexes, this part is quite faster than the first!
const coords = Array.from(
  finalWarehouse.matchAll(/\[\]/g),
  ({ index }) => index).map(index => Math.floor(index / (width + 1)) * 100 + (index % (width + 1))
);
console.log(coords.reduce((sum, coord) => sum + coord));
