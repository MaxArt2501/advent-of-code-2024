const [rules, updates] = input.trim().split('\n\n')
  // Splitting by /\D/ would split by '|' and ',' too
  .map(chunk => chunk.split('\n').map(line => line.split(/\D/).map(Number)));

/** Return the first rule that is broken in the given update */
const findBrokenRule = update => rules.find(([a, b]) => {
  const i = update.indexOf(a);
  const j = update.indexOf(b);
  // If the update doesn't contain both a and b, the rule isn't broken.
  // However, we only need to check if j >= 0, since if i === -1 then i < j.
  return j >= 0 && j < i;
});

const { invalid, ordered } = Object.groupBy(updates,
  // If no rules are broken, then the update is ordered
  update => findBrokenRule(update) ? 'invalid' : 'ordered');

const getMiddlePagesSum = updateList => updateList.reduce(
  // Bitshift an integer to the right is the same as Math.floor(num / 2).
  (sum, update) => sum + update[update.length >> 1], 0
);

console.log(getMiddlePagesSum(ordered));

const sortUpdate = update => {
  let brokenRule;
  // Algorithm: find the first broken rule and adjust the page list so the rule
  // isn't broken anymore. Repeat until no more rules are broken.
  while (brokenRule = findBrokenRule(update)) {
    const [a, b] = brokenRule;
    const i = update.indexOf(a);
    const j = update.indexOf(b);
    // Bring the first page number of the rule right before the second.
    // This *could* possibly break another previous rule, but we can fix that
    // on the next iteration. Since we can assume the rules are coherent, in the
    // end we'll end up with a correctly ordered update.
    // I *could* have used .toSpliced twice here instead, but personally I
    // think that would have been a little less readable.
    update = [
      ...update.slice(0, j),
      a, b,
      ...update.slice(j + 1, i),
      ...update.slice(i + 1)
    ];
  }
  return update;
};

const reordered = invalid.map(sortUpdate);

console.log(getMiddlePagesSum(reordered));
