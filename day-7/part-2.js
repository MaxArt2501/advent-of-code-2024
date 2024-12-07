const equations = input.trim().split('\n').map(line => line.split(/\D+/).map(Number));

const canBeComputed = ([target, ...terms]) => {
  // Welp... now we need to check for *three* operators...
  // Same as before, we try them all until we find a combination that works
  for (let combination = 0, limit = 3 ** (terms.length - 1); combination < limit; combination++) {
    const result = terms.reduce(
      (partial, term, index) => {
        const operator = Math.floor(combination / 3 ** (index - 1)) % 3;
        if (operator === 2) {
          // The number of figures in the term. Using math is ~20% faster than
          // string concatenation... And we need fast here
          const order = Math.ceil(Math.log10(term + 1));
          return partial * 10 ** order + term;
        }
        return operator ? partial * term : partial + term;
      }
    );
    if (result === target) return true;
  }
  return false;
};

// It took ~6.6 seconds on my Ryzen 5 3600 to run this, ~20 s on my phone
// (with Snapdragon 855)
const computable = equations.filter(canBeComputed);
console.log(computable.reduce((sum, [target]) => sum + target, 0));
