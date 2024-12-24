let [a, b, c, ...program] = input.trim().match(/\d+/g).map(Number);

const output = [];

let instructionPointer = 0;

const combo = (n) => (n > 3 ? [a, b, c][n - 4] : n);
// Mapping the opcodes to the instructions. Warning: bitwise operators may not
// produce what you expect if the operands are larger than 32 bits. But it
// shouldn't be the case for part 1.
const instructions = [
  (n) => (a = a >> combo(n)),
  (n) => (b ^= n),
  (n) => (b = combo(n) & 7),
  (n) => (instructionPointer = !a ? instructionPointer : --n << 1),
  (_) => (b ^= c),
  (n) => output.push(combo(n) & 7),
  (n) => (b = a >> combo(n)),
  (n) => (c = a >> combo(n)),
];

// Just running the program...
for (; instructionPointer < program.length; instructionPointer += 2) {
  instructions[program[instructionPointer]](program[instructionPointer + 1]);
}

console.log(output.join());
