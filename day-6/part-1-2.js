const width = input.indexOf('\n');
// Tracking the position of the guard with just their index on the map.
const startPosition = input.indexOf('^');
// Changing rows means adding or subtracting `width + 1`
const dirDiffs = [-width - 1, 1, width + 1, -1];

const getPath = (field) => {
  // This will contain the visited squares, including the direction (this will
  // be useful in the second part).
  const path = new Set();
  let position = startPosition;
  let direction = 0;

  do {
    path.add(`${position}-${direction}`);
    const newPosition = position + dirDiffs[direction];
    const cell = field[newPosition];
    // We've reached the boundary of the field
    if (cell === '\n' || cell === undefined) break;
    if (cell === '#') {
      // Reached an obstable, turn right
      direction = (direction + 1) % 4;
    } else {
      // Empty cell, set new position
      position = newPosition;
    }
    // Check if we visited the same square in the same direction: that would
    // mean we're in a loop (again, for the second part).
  } while(!path.has(`${position}-${direction}`));
  return path;
};

// For the first part, we don't care about the direction, so we only need to
// keep track of the visited squares. Remove the direction information from the
// path, and make the positions unique with a Set.
const visited = new Set(Array.from(getPath(input), position => Number(position.slice(0, -2))));
console.log(visited.size);

const looperObstacles = [];
// This isn't efficient at all. But it works!
// We try to place an obstacle in every square that we've visited before.
visited.forEach(position => {
  // We cannot place an obstacle at the starting position
  if (position === startPosition) return;

  const field = input.slice(0, position) + '#' + input.slice(position + 1);

  // Recalculate the path with the new obstacle
  const path = getPath(field);
  // We check the last step. If it's on the boundary and pointing outside the
  // field, then it's *not* a loop.
  const lastStep = Array.from(path).pop();
  const [lastPosition, lastDirection] = lastStep.split('-').map(Number);
  const isLeaving = lastPosition < width && lastDirection === 0
    || lastPosition + width + 1 > field.length && lastDirection === 2
    || (lastPosition % (width + 1)) === 0 && lastDirection === 3
    || (lastPosition % (width + 1)) === width - 1 && lastDirection === 1;
  if (!isLeaving) looperObstacles.push(position);
});
console.log(looperObstacles.length);
