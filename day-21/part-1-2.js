const codes = input.trim().split('\n');

// Generating maps from each key to its coordinates. I don't like doing things
// by hand, although it's kind of silly in this case...
const getKeyMap = keys => Object.fromEntries(
  keys.split('').map((num, index) => [num, [Math.floor(index / 3), index % 3]])
);

const numKeyMap = getKeyMap('789456123 0A');
const dirKeyMap = getKeyMap(' ^A<v>');

const getShortestSequence = (sequence, keyMap) => {
  let [row, col] = keyMap.A;
  let [gapRow, gapCol] = keyMap[' '];
  const moves = [];
  for (const char of sequence) {
    const [targetRow, targetCol] = keyMap[char];
    const rowDir = targetRow < row ? '^' : 'v';
    const colDir = targetCol < col ? '<' : '>';
    const horizontalMove = colDir.repeat(Math.abs(targetCol - col));
    const verticalMove = rowDir.repeat(Math.abs(targetRow - row));
    // We check if we should move horizontally first, but we need to make sure
    // we can (or should). In the example, moves like '<v<' could be technically
    // allowed, but they're inefficient for the robot (or human) that need to
    // replicate them using a middleware robot.
    if (
      // This condition means if we move vertically first, we'd pass through
      // the gap; so we must move horizontally first.
      col === gapCol && targetRow === gapRow ||
      // Also, if the horizontal move is to the left, we need to do *that* first
      // because the left key is the farthest key from the A. The problem would
      // not be in *this* evolution, but in the *next*, where a step to the
      // left would result in a longer movement sequence. (Note: this is a
      // special heuristic for *this* particular disposition of directional
      // keys: I guess it could be generalized, but I'm not doing that.) So we
      // move horizontally first...
      colDir === '<' &&
      // ... *unless* moving horizontally first would pass through the gap, so
      // we need to exclude that case. (Also these "passing through the gap"
      // logics are again relative to these particular key dispositions.)
      !(targetCol === gapCol && row === gapRow)
    ) {
      moves.push(horizontalMove + verticalMove + 'A');
    } else {
      // Otherwise, we move vertically first.
      moves.push(verticalMove + horizontalMove + 'A');
    }
    row = targetRow;
    col = targetCol;
  }
  return moves;
};

console.log(codes.reduce(
  (sum, code) => sum + getShortestSequence(
    getShortestSequence(
      getShortestSequence(code, numKeyMap).join(''),
      dirKeyMap
    ).join(''),
    dirKeyMap
  ).join('').length * parseInt(code), 0)
);

// For the second part, we need to change the approach. Point is, we don't need
// to know the exact sequence, only its *length*. So what we actually need is to
// know how the shortest sequence grows after each robot interaction.
// In order to do so, since each sequence starts with the robot pointing at the
// 'A' key, we can split each sequence into sub-sequences that ends with 'A'.
// Then, we can pre-calculate how this sequence is transformed into a series of
// other sub-sequences by the next robot interaction.
// All the possible sub-sequences are quite limited, actually, as horizontal
// movements are at most of 2 steps, while vertical are at most of 3 steps.
// Some of these sub-sequences won't actually be used but eh, it doesn't waste
// much time anyway.
const movementMap = {
  A: ['A']
};
const addSequenceToMap = sequence => {
  // We split each sequence into sub-sequences that end with 'A'.
  movementMap[sequence + 'A'] = getShortestSequence(sequence + 'A', dirKeyMap);
};
['<', '<<', '>', '>>'].forEach(addSequenceToMap);
for (const vCount of [1, 2, 3]) {
  const upMove = '^'.repeat(vCount);
  const downMove = 'v'.repeat(vCount);
  [upMove, downMove].forEach(addSequenceToMap);
  for (const hCount of [1, 2]) {
    const leftMove = '<'.repeat(hCount);
    const rightMove = '>'.repeat(hCount);
    [
      upMove + leftMove,
      upMove + rightMove,
      downMove + leftMove,
      downMove + rightMove,
      leftMove + upMove,
      leftMove + downMove,
      rightMove + upMove,
      rightMove + downMove
    ].forEach(addSequenceToMap);
  }
}

// Then we start counting.
const getShortestSequenceLength = (code, robots) => {
  // We map the sub-sequence we have to the number of times they occur. That's
  // all we need.
  let seqCount = new Map();
  for (const subsequence of getShortestSequence(code, numKeyMap)) {
    seqCount.set(subsequence, (seqCount.get(subsequence) ?? 0) + 1);
  }

  // We apply the robot interactions.
  for (let index = 0; index < robots; index++) {
    const newSeqCount = new Map();
    for (const [subsequence, count] of seqCount) {
      for (const movement of movementMap[subsequence]) {
        newSeqCount.set(movement, (newSeqCount.get(movement) ?? 0) + count);
      }
    }
    seqCount = newSeqCount;
  }
  return Array.from(seqCount.entries()).reduce((sum, [sequence, count]) => sum + count * sequence.length, 0);
};
// By the way, replace '25' with '2' and you get the result of the first part.
console.log(codes.reduce((sum, code) => sum + getShortestSequenceLength(code, 25) * parseInt(code), 0));
