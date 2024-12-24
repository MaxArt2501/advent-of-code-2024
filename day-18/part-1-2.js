const width = 71; // From the text...
// I'm now more comfortable to map everything to a single number. Sorry if
// it's not clear...
const byteList = input.trim().split('\n').map(line => {
  const [x, y] = line.split(',').map(Number);
  return y * width + x;
});

const exit = width * width - 1;
// Classic breadth-first search...
const fallenBytes = new Set(byteList.slice(0, 1024));
const getMinSteps = fallenBytes => {
  const visited = new Map([[0, 0]]);
  let frontier = new Set([0]);
  let minSteps = Infinity;
  let steps = 0;

  while (frontier.size) {
    steps++;
    const newFrontier = new Set();
    for (const position of frontier) {
      for (const direction of [-width, 1, width, -1]) {
        const newPosition = position + direction;
        if (
          newPosition < 0 ||
          newPosition > exit ||
          // This is a wall
          (direction === 1 && newPosition % width === 0) ||
          (direction === -1 && position % width === 0) ||
          fallenBytes.has(newPosition) ||
          visited.get(newPosition) <= steps
        ) {
          continue;
        }
        if (newPosition === exit) {
          minSteps = Math.min(minSteps, steps);
        } else {
          newFrontier.add(newPosition);
          visited.set(newPosition, steps);
        }
      }
    }
    frontier = newFrontier;
  }
  return minSteps;
};

console.log(getMinSteps(fallenBytes));

// Keep on falling bytes until there's no more a viable path. Not the fastest
// solution maybe, but it works.
for (let index = 1024; index < byteList.length; index++) {
  const byte = byteList[index];
  fallenBytes.add(byte);
  const steps = getMinSteps(fallenBytes);
  if (!Number.isFinite(steps)) {
    console.log(`${byte % width},${Math.floor(byte / width)}`);
    break;
  }
}
