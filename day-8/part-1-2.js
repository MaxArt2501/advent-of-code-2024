const width = input.indexOf('\n');
const height = input.trim().split('\n').length;

const antennas = Array.from(input.matchAll(/\w/g), ({ index, 0: type }) => {
  const row = Math.floor(index / (width + 1));
  const column = index % (width + 1);
  return { type, row, column };
});
const groups = Object.groupBy(antennas, ({ type }) => type);

/**
 * @param {(number, number) => number[]} getMultipliers This is needed
 * especially for part 2. It gives the multipliers for the difference of rows
 * and columns to be added to the coordinates of an antenna.
 */
const countAntinodes = (getMultipliers) => {
  const antinodes = new Set();
  Object.values(groups).forEach(group => {
    group.forEach(({ row, column }, index) => {
      for (let k = index + 1; k < group.length; k++) {
        const rowDiff = row - group[k].row;
        const columnDiff = column - group[k].column;
        for (const multiplier of getMultipliers(rowDiff, columnDiff)) {
          const antinodeRow = row + rowDiff * multiplier;
          const antinodeColumn = column + columnDiff * multiplier;
          if (antinodeRow >= 0 && antinodeRow < height && antinodeColumn >= 0 && antinodeColumn < width) {
            antinodes.add(`${antinodeRow},${antinodeColumn}`);
          }
        }
      }
    });
  });
  return antinodes.size;
};

// For the first part, the multipliers are always 1 and -2.
console.log(countAntinodes(() => [1, -2]));

// For the second part, we can have more multipliers, depending on the differece
// of rows and columns.
console.log(countAntinodes((rowDiff, columnDiff) => {
  const count = Math.ceil(Math.max(height / Math.abs(rowDiff), width / Math.abs(columnDiff)));
  return Array.from({ length: count * 2 }, (_, index) => index - count);
}));
