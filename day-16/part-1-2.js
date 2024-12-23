const width = input.indexOf('\n');
const startTile = input.indexOf('S');
const endTile = input.indexOf('E');
// We map each visited tile with its (minimum) cost at that point. If we reach
// the same tile with a higher cost, we know it's not part of the path.
const visited = new Map([[startTile, 0]]);
const directions = [-width - 1, 1, width + 1, -1];

let frontier = new Map([[startTile, [0, 1]]]);
while (frontier.size) {
  const newFrontier = new Map();
  for (const [lastPosition, [cost, lastDirection]] of frontier) {
    for (const direction of directions) {
      if (direction === -lastDirection) continue;
      const position = lastPosition + direction;
      const cell = input[position];
      if (cell !== '#') {
        const newCost = cost + (direction === lastDirection ? 1 : 1001);
        if (visited.get(position) < newCost || newFrontier.get(position)?.[0] < newCost) continue;
        visited.set(position, newCost);
        newFrontier.set(position, [newCost, direction]);
      }
    }
  }
  frontier = newFrontier;
}

console.log(visited.get(endTile));

// The gist is to count the cells in the path from the end to the start.
// To do so, we're going to use the `visited` map we've just generated, then we
// are going backward choosing the tiles that are only possible if belonging to
// a lowest-cost path.
// We start by saying that the end tile is part of the path...
const pathTiles = new Set([endTile]);

// In the frontier, we keep the path tiles we last visited, mapped to the
// previous tile in the path. We need it to actually recognize the "correct"
// path tiles. In fact, we can't simply take all the nearby tiles with a lower
// cost, because there might be some that are not part of the path. Consider
// this case:
//
// ########
// #.....E#
// #.##.###
// #..#...#
// ##.###.#
// #S.....#
// ########
//
// There are only two possible paths, but the leftmost one has a cost of 4010,
// while the other has a cost of 4012. Nearby the tile on row 1, column 4 (the
// junction before the end tile), which has a cost of 3011, there is only one
// tile nearby with a lower cost - the one below with 3010 - which is *not*
// part of the lowest-cost path. We need to take the tile on the left, with a
// cost of 4007.
let backFrontier = new Map([[endTile, NaN]]);
while (backFrontier.size) {
  const newBackFrontier = new Map();
  for (const [position, previous] of backFrontier) {
    if (position === startTile) break;

    const previousDirection = position - previous;
    const cost = visited.get(position);
    const previousCost = visited.get(previous);

    for (const direction of directions) {
      const newPosition = position + direction;
      const newCost = visited.get(newPosition);
      if (newCost === undefined) continue; // It's a wall

      // This accounts for quite some edge cases. The first is for when we start
      // from the end, the other two are basically to deal with path junctions.
      // It's messy and I don't quite like it. I think there smarter ways to
      // handle this, e.g.: the thousands of the cost on a tile tells the number
      // of turns we've taken up to that tile, while cost modulo 1000 is the
      // distance from the start. We can work on that instead.
      // But anyway, it works.
      if (
        !previousCost && newCost < cost ||
        direction === previousDirection && (newCost <= cost - 1 || newCost <= previousCost - 2) ||
        direction !== previousDirection && newCost <= previousCost - 1002
      ) {
        newBackFrontier.set(newPosition, position);
        pathTiles.add(newPosition);
      }
    }
  }
  backFrontier = newBackFrontier;
}
console.log(pathTiles.size);
