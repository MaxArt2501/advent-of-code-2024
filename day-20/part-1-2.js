// I've tried so, so hard to come up with a good solution for this one. First,
// I had to actually understand the problem, as it wasn't clear how a 2 ps cheat
// could be used (I've thought I could pass a 2-tile thick wall). Then, for the
// first part, I tried to find all the 1-tile thick walls.
// Then the second part came and I had to rethink everything from scratch, until
// I realized that:
// - I could pass more than one wall when the cheat is on;
// - I could map each track tile to its distance from the start;
// - the time saved is merely the differenze between the "score" of the cheat's
//   end tile minus the "score" of the cheat's start tile, minus the "length" of
//   the cheat (which is the taxicab distance between its start and end tile).
// This could be applied to both parts, so... there you go.
const width = input.indexOf('\n');
const start = input.indexOf('S');
const end = input.indexOf('E');

let position = start;
// The distance of a track tile from the start is merely its index in the `steps`
// array.
const steps = [start];
while (position !== end) {
  for (const direction of [-width - 1, 1, width + 1, -1]) {
    const newPosition = position + direction;
    if (input[newPosition] !== '#' && !steps.includes(newPosition)) {
      steps.push(newPosition);
      position = newPosition;
      break;
    }
  }
}

const getDistance = (a, b) =>
  Math.abs((a % (width + 1)) - (b % (width + 1))) +
  Math.abs(Math.floor(a / (width + 1)) - Math.floor(b / (width + 1)));

const MIN_CHEAT = 100;

const getGoodCheatCount = (maxCheatDuration) => {
  let goodCheats = 0;
  steps
    .forEach((a, step) =>
      // This could be optimized, as we should try to reach a tile that's at
      // least MIN_CHEAT steps ahead. But whatever, it's fast enough.
      steps.slice(step + 1).forEach((b, stepDiff) => {
        const dist = getDistance(a, b);
        if (dist <= maxCheatDuration && stepDiff + 1 - dist >= MIN_CHEAT) goodCheats++;
      })
    );
}

console.log(getGoodCheatCount(2));
console.log(getGoodCheatCount(20));
