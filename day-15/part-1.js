const [warehouse, moves] = input.trim().split('\n\n');

const width = warehouse.indexOf('\n');

// I don't know why I love regexes so much... It's a "write-only" language that
// everybody should loathe. At this point, I should love Tailwind too.
// (Actually, this is something I do fo fun. I don't use regexes that much on my
// job.) (And neither Tailwind.)
const moveUpMatcher = new RegExp(
  `\\.([\\s\\S]{${width}\}O)*([\\s\\S]{${width}\})@`
);
const moveDownMatcher = new RegExp(
  `@(?:[\\s\\S]{${width}\}O)*[\\s\\S]{${width}\}\\.`
);

const moveUpReplacer = (match) =>
  Array.from(
    { length: match.length / (width + 1) },
    (_, index) =>
      match[(index + 1) * (width + 1)] +
      match.slice(index * (width + 1) + 1, (index + 1) * (width + 1))
  ).join('') + '.';

const moveDownReplacer = (match) => '.' +
  Array.from(
    { length: match.length / (width + 1) },
    (_, index) =>
      match.slice(index * (width + 1) + 1, (index + 1) * (width + 1)) +
      match[index * (width + 1)]
  ).join('');

const moveRobot = {
  '^': (warehouse) => warehouse.replace(moveUpMatcher, moveUpReplacer),
  '>': (warehouse) => warehouse.replace(/@(O*)\./, '.@$1'),
  v: (warehouse) => warehouse.replace(moveDownMatcher, moveDownReplacer),
  '<': (warehouse) => warehouse.replace(/\.(O*)@/, '$1@.')
};

const finalWarehouse = moves.split(/\n?/).reduce((warehouse, direction) => moveRobot[direction](warehouse), warehouse);
const coords = Array.from(
  finalWarehouse.matchAll(/O/g),
  ({ index }) => index).map(index => Math.floor(index / (width + 1)) * 100 + (index % (width + 1))
);
console.log(coords.reduce((sum, coord) => sum + coord));
