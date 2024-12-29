// Forget the instructions' representation! Unleash the power of ES2025!
const { true: locks, false: keys } = Object.groupBy(
  input.trim().split('\n\n').map(block => new Set(Array.from(block.matchAll(/#/g), ({ index }) => index))),
  pieces => pieces.has(0)
);

const combinations = locks.reduce((total, lock) => total + keys.filter(key => lock.isDisjointFrom(key)).length, 0);
console.log(combinations);
