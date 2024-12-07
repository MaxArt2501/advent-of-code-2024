const equations = input.trim().split('\n').map(line => line.split(/\D+/).map(Number));

const canBeComputed = ([target, ...terms]) => {
  // Unfortunately, we need to use brute force here. If we have n terms, then
  // there are 2^(n-1) possible combinations of operators. We try them all
  // until we find one that works.
  for (let combination = 0, limit = 1 << (terms.length - 1); combination < limit; combination++) {
    const result = terms.reduce(
      (partial, term, index) => {
        // Use some binary math to figure out which operator to use
        const operator = combination & (1 << index - 1);
        return operator ? partial * term : partial + term;
      }
    );
    if (result === target) return true;
  }
  return false;
};

const computable = equations.filter(canBeComputed);
console.log(computable.reduce((sum, [target]) => sum + target, 0));
