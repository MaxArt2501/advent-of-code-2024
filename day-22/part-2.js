const secrets = input.trim().split('\n').map(Number);
const PRUNE_VALUE = 16777215;

function* getPrices(secret) {
  let value = secret;
  yield value % 10;
  for (let count = 0; count < 2000; count++) {
    value = ((value << 6) ^ value) & PRUNE_VALUE;
    value = ((value >> 5) ^ value) & PRUNE_VALUE;
    value = ((value << 11) ^ value) & PRUNE_VALUE;
    yield value % 10;
  }
}

const priceSequences = secrets.map((secret) => Array.from(getPrices(secret)));

const getPriceAfterSequence = (priceSequence, sequence) => {
  const foundIndex = priceSequence.findIndex((_, j) =>
    sequence.every(
      (diff, k) => priceSequence[j - sequence.length + k + 1] - priceSequence[j - sequence.length + k] === diff
    )
  );
  return foundIndex === -1 ? 0 : priceSequence[foundIndex];
};

let maxBananas = 0;
// So, how do we do this? Simple: we try every possible combination of 4 digit shifts.
// This... will take a while (~1hr or so). Maybe I'll find something more efficient later.
for (let n0 = -9; n0 < 10; n0++) {
  for (let n1 = Math.max(-9, -9 - n0); n1 <= Math.min(9, 9 - n0); n1++) {
    for (let n2 = Math.max(-9, -9 - n0 - n1); n2 <= Math.min(9, 9 - n0 - n1); n2++) {
      for (let n3 = Math.max(-9, -9 - n0 - n1 - n2); n3 <= Math.min(9, 9 - n0 - n1 - n2); n3++) {
        const sequence = [n0, n1, n2, n3];
        const bananas = priceSequences.reduce(
          (total, priceSequence) => total + getPriceAfterSequence(priceSequence, sequence),
          0
        );
        if (bananas > maxBananas) maxBananas = bananas;
      }
    }
  }
}
console.log(maxBananas);
