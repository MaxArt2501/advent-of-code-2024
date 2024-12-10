const width = input.indexOf('\n');
const trailheads = Array.from(input.matchAll(/0/g), ({ index }) => index);

// Performs a breadth-first search, keeping track of the peaks that have been
// reached. Our frontier will contain not just the last position, but the whole
// up to that point (will need it for the second part).
const getScore = trailhead => {
  let frontier = new Set([trailhead]);
  let score = 0;
  const reachedPeaks = new Set();
  while (frontier.size) {
    const newFrontier = new Set();
    for (const trail of frontier) {
      const position = Number.parseInt(trail);
      const height = input[position];
      // If we add (width + 1) to the current position, we get the next row at
      // the same column. This means we try to move up, right, down and left.
      // Yes, we could go out of bounds. JavaScript doesn't throw, it just
      // returns undefined. Yes, we can get a newline instead of a numeric
      // character. JavaScript doesn't throw when subtracting, it just returns
      // NaN.
      for (const diff of [-width - 1, 1, width + 1, -1]) {
        const nextPosition = position + diff;
        const nextHeight = input[nextPosition];
        if (nextHeight - height === 1) {
          if (nextHeight === '9') {
            score++;
            reachedPeaks.add(nextPosition);
          // We set the next position as the first, so we can later use parseInt
          // to get the last position
          } else newFrontier.add(nextPosition + '-' + trail);
        }
      }
    }
    frontier = newFrontier;
  }
  return { part1: reachedPeaks.size, part2: score };
};

const scores = trailheads.map(trailhead => getScore(trailhead));
console.log(scores.reduce((total, { part1 }) => total + part1, 0));
console.log(scores.reduce((total, { part2 }) => total + part2, 0));
