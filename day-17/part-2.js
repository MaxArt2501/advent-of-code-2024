// This is especially crafted for MY CASE ONLY. Here's some explanations.
// I basically needed to disassemle the program and figure out what it's doing.
// From what I've seen from my case and other people's data, we can assume the
// following:
// 1. The last instruction resets the instruction pointer to 0 if `a` isn't 0,
//    so basically the program is a loop that runs until `a` isn't 0.
// 2. After every iteration, `a` is shifted 3 bits to the right (basically,
//    divided by 8).
// 3. For every iteration, we set `b` to the less-significant 3 bits from `a`,
//    and `c` to some more-significant 3 bits.
// 4. There's a XOR operation between `b` and `c` that determines the output
//    for that iteration.
// 5. The program is 8 instructions long (= 16 numbers).
// So, if we want some number to be output, we need to find a special `a` that
// ends up with that number. We're working with bits, here.

const output = [];
// This is the disassembled program for MY case. Your values, if not explicitly
// stated in the above explanation, may vary for your case.
// I've resorted to flooring the result of division instead of bitwise shifting
// because we're dealing with integers larger than 32 bits.
const run = (a, b, c) => {
  b = a & 7;                    // 2,4
  b ^= 1;                       // 1,1
  c = Math.floor(a / (2 ** b)); // 7,5
  b ^= 5;                       // 1,5
  b ^= c;                       // 4,5
  a = Math.floor(a / 8);        // 0,3
  output.push(b & 7);           // 5,5
  if (a) run(a, b, c);          // 3,0
};

const getOutput = (a, b, c) => {
  output.length = 0;
  run(a, b, c);
  return output.join();
};

const getPossibleNums = (bits) => {
  let possible = [0];
  bits.forEach(bit => {
    if (typeof bit === 'number') {
      possible = possible.map(p => p * 2 + bit);
    } else {
      possible = possible.flatMap(p => [p * 2, p * 2 + 1]);
    }
  })
  return possible;
};

const canDo = (target, bits) => {
  if (target >> bits.length) return false;
  return bits.every((bit, i) => typeof bit !== 'number' || (target >> (bits.length - i - 1) & 1) === bit);
};

// In the end, I'm quite proud of this function. I've worked quite a bit on it.
// Just remember it's specially crafted for MY CASE.
// The idea is to find all possible `a` values that makes the program output
// some number. We also pass an array of bits that represents our constraints
// on `a`. The only issue is that it works backwards with the given bits,
// because other helper functions (namely `toInt` and `canDo`) do as well.
// A "bit" from the array can be 0, 1 or null if the bit is still unconstrained.
const findForOutput = (number, fixedBits) => {
  const possible = [];
  const head = fixedBits.slice(0, -3);
  getPossibleNums(fixedBits.slice(-3)).forEach(a03 => {
    const bits = head.concat([a03 >> 2 & 1, a03 >> 1 & 1, a03 & 1]);
    // For the given value for `a`, we can compute the value for `c` that we
    // need to output the given number.
    const targetC = number ^ a03 ^ 4;
    // Where we need to set the bits that will determine `c` for this iteration
    const bitIndex = bits.length - 3 - (a03 ^ 1);
    // The bits for `c` could have constraints already set. We need to check if
    // the value we computed for `c` is compatible with those constraints.
    if (canDo(targetC, bits.slice(bitIndex, bitIndex + 3))) {
      // We can set the bits, then put the bit array among the possible ones.
      for (let i = 0; i < 3; i++) {
        bits[bitIndex + 2 - i] = targetC >> i & 1;
      }
      possible.push(bits);
    }
  });
  return possible;
};

const toInt = (bits) => bits.reduce((sum, bit) => sum * 2 + bit, 0);

// We start with a bit array where all the bits are undecided. Why 53? Because
// we need to output 16 numbers, so the program must do 16 iterations. Which
// means that `a` - which is shifted to the right by 3 bits at every iteration
// - is at least 2 ** 48 large, and that'd spare 5 bits. A program of 9
// instructions would need 54 bits, but integers can't be larger than 2 ** 53
// due to the common representation of numbers in several languages (including
// JavaScript). On the other hand, right-shifting `a` of only 2 bits would have
// made brute force a possibility.
let bitGroups = [Array(53).fill(null)];
program.forEach((opcode, index) => {
  bitGroups = bitGroups.flatMap(bits => findForOutput(opcode, bits.slice(0, bits.length - 3 * index)).map(bitList => bitList.concat(bits.slice(bits.length - 3 * index))));
});
// Some values may output more numbers after the end of the program list
const possibleAs = bitGroups.map(toInt).filter(a => getOutput(a, 0, 0) === program.join());
console.log(Math.min(...possibleAs));
