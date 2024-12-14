const robots = input.trim().split('\n')
  .map((line) => line.match(/-?\d+/g).map(Number));

const evolve = (robots, seconds, width, height) =>
  robots.map(([x, y, vx, vy]) => [
    (((x + vx * seconds) % width) + width) % width,
    (((y + vy * seconds) % height) + height) % height,
    vx,
    vy,
  ]);

// A figure like a Christmas tree *should* minimize the total quadratic distance
// between all pairs of robots, as it *should* be a compact figure.
const getTotalQuadraticDistance = (robots) => {
  let total = 0;
  for (let index = 0; index < robots.length; index++) {
    const [x1, y1] = robots[index];
    for (let j = index + 1; j < robots.length; j++) {
      const [x2, y2] = robots[j];
      total += (x1 - x2) ** 2 + (y1 - y2) ** 2;
    }
  }
  return total;
};

// The figures repeat after 101 * 103 seconds: since 101 and 103 are primes,
// each robot's x coordinate repeats every 101 seconds and each robot's y
// coordinate repeats every 103 seconds, so each robot's coordinates repeat
// every 101 * 103 seconds. Hope it's generic enough...
const quadraticDistances = Array.from(
  { length: 101 * 103 },
  (_, seconds) => getTotalQuadraticDistance(evolve(robots, seconds, 101, 103))
);

// A visualization of the first 101 * 103 seconds can be found in the file
// `evolution.png` (~13.6 MB, 1919 pixels wide, 56444 pixel tall).

const minQuadraticDistance = Math.min(...quadraticDistances);

console.log(quadraticDistances.indexOf(minQuadraticDistance));
