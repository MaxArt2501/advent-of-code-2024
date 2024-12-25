const [towels, designs] = input.trim().split('\n\n').map(block => block.split(/[^a-z]+/));

// Caching is our jam today! We map a sequence of stripes to the number of
// possible combinations. Then we can apply this to both parts of today's
// challenge. Easy peasy.
const combinationMap = { '': 1 };
const getCombinations = (design) => {
  if (!(design in combinationMap))
    combinationMap[design] = towels.reduce(
      (sum, towel) => sum + (design.startsWith(towel) ? getCombinations(design.slice(towel.length)) : 0),
      0
    );
  return combinationMap[design];
};

const possibleDesigns = designs.filter(design => getCombinations(design) > 0);
console.log(possibleDesigns.length);
console.log(possibleDesigns.reduce((sum, design) => sum + combinationMap[design], 0));
