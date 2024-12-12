const width = input.indexOf('\n');

const getRegion = (startIndex) => {
  const plot = input[startIndex];
  const sides = [];
  const region = new Set([startIndex]);
  let frontier = new Set([startIndex]);
  let perimeter = 0;
  while (frontier.size) {
    const newFrontier = new Set();
    for (const index of frontier) {
      // Look the blocks around the current cell
      for (const diff of [-width - 1, 1, width + 1, -1]) {
        const newPlot = input[index + diff];
        if (newPlot === plot) {
          if (!region.has(index + diff)) {
            // It's a block of the same that hasn't been already visited.
            newFrontier.add(index + diff);
            region.add(index + diff);
          }
        } else {
          // It doesn't matter if it's a letter, a newline or undefined: it's
          // still outside the region. Therefore the cell is a border cell.
          perimeter++;

          // This is for the second part. We're generating the sides of the
          // region, which are determined by the direction (which could be
          // `diff`) and the adjacent border cells in a straight line.

          // This basically tells if we need to check for a border cell in the
          // vertical or horizontal direction: if we're facing left (-1) or
          // right (1), we need to check up or down, and vice versa.
          const checkDiff = Math.abs(diff) === 1 ? width + 1 : 1;

          // We're looking for a possible side where this border cell should be.
          // **It could be more than one**, as the same side could be generated
          // from multiple starting points. That's why there could be **two**
          // adjacent sides. This costed me quite some debugging time...
          const adjacentSides = sides.filter(
            ({ plots, diff: sideDiff }) =>
              sideDiff === diff &&
              plots.some(
                (plotIndex) =>
                  plotIndex + checkDiff === index ||
                  plotIndex - checkDiff === index
              )
          );
          if (adjacentSides.length) {
            adjacentSides[0].plots.push(index);
            if (adjacentSides.length === 2) {
              // If there are two adjacent sides, we merge them.
              adjacentSides[0].plots.push(...adjacentSides[1].plots);
              sides.splice(sides.indexOf(adjacentSides[1]), 1);
            }
          } else sides.push({ plots: [index], diff });
        }
      }
    }
    frontier = newFrontier;
  }
  return { region, perimeter, sides };
};

const getNextIndex = (startIndex) => {
  for (let index = startIndex; index < input.length; index++) {
    if (!input[index]) return -1;
    if (input[index] === '\n') index++;
    if (!visited.has(index)) return index;
  }
};

const visited = new Set();
let totalPricePart1 = 0;
let totalPricePart2 = 0;
let lastStart = 0;
let index;
while ((index = getNextIndex(lastStart)) >= 0) {
  const { region, perimeter, sides } = getRegion(index);
  totalPricePart1 += perimeter * region.size;
  totalPricePart2 += sides.length * region.size;
  region.forEach((plotIndex) => visited.add(plotIndex));
  lastStart = index;
}

console.log(totalPricePart1);
console.log(totalPricePart2);
