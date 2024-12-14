const robots = input.trim().split('\n').map((line) => line.match(/-?\d+/g).map(Number));

const evolve = (robots, seconds, width, height) =>
  robots.map(([x, y, vx, vy]) => [
    (((x + vx * seconds) % width) + width) % width,
    (((y + vy * seconds) % height) + height) % height,
    vx,
    vy,
  ]);

const getQuadrant = ([x, y], width, height) => {
  if (x === width >> 1 || y === height >> 1) return -1;
  return (x < width >> 1) + (y < height >> 1) * 2;
};

const robotGroups = Object.groupBy(
  evolve(robots, 100, 101, 103),
  robot => getQuadrant(robot, 101, 103)
);

const quadrantCount = Array.from({ ...robotGroups, length: 4 }, group => group.length);
const safetyFactor = quadrantCount.reduce((product, count) => product * count);

console.log(safetyFactor);
