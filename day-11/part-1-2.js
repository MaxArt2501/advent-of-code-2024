const stones = input.split(' ').map(Number);

const blink = (stoneList, count) => {
  const newList = [];
  for (const stone of stoneList) {
    if (stone === 0) newList.push(1);
    else {
      // Using Math because it's faster (probably won't matter much though).
      const numLength = Math.ceil(Math.log10(stone + 1));
      if (numLength & 1) newList.push(stone * 2024);
      else newList.push(
        Math.floor(stone / 10 ** (numLength >> 1)),
        stone % 10 ** (numLength >> 1)
      );
    }
  }
  return count > 1 ? blink(newList, count - 1) : newList;
};

// We could also compute this part with the solution for the second part, as
// this is way less efficient, but... eh, I'll leave it as I first conceived it.
console.log(blink(stones, 25).length);

// 25 iterations is a thing, 75 is totally different. The point here is that
// most of the calculations for a given stone have already been done at some
// point, so we souldn't doing them again. And lo, here's a cache to keep the
// temporary results... It'll make a world of difference.
// Using a Map would probably be more efficient here, but this is fast enough.
const stoneLengthCache = {};
// The "length" of a stone is how many stones will be generated after `count`
// blinks.
const getLength = (stone, count) => {
  if (count < 1) return 1;

  const key = `${stone}@${count}`;
  let length = stoneLengthCache[key];
  if (!length) {
    length = blink([stone], 1).reduce((sum, childStone) => sum + getLength(childStone, count - 1), 0);
    stoneLengthCache[key] = length;
  }
  return length;
};

const totalLength = stones.reduce((sum, stone) => sum + getLength(stone, 75), 0);
console.log(totalLength);
