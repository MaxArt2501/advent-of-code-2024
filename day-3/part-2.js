// We have optional capturing groups here
const matcher = /(do(?:n't)?)\(\)|mul\((\d+),(\d+)\)/g;
let sum = 0;
let enabled = true;
for (const [, instruction, a, b] of input.matchAll(matcher)) {
  if (instruction) enabled = instruction === 'do';
  else if (enabled) sum += a * b;
}
console.log(sum);
