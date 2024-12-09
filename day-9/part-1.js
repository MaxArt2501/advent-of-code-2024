const lengths = Uint8Array.from(input.trim(), (c) => +c);
const diskSize = lengths.reduce((sum, length) => sum + length);
const disk = new Int16Array(diskSize);

let pos = 0;
lengths.forEach((length, index) => {
  // We mark the disk with -1 for free space, or the file id, for the length of
  // the sequence
  const filler = (index & 1) ? -1 : (index >> 1);
  disk.set(new Int16Array(length).fill(filler), pos);
  pos += length;
});

// Using a generator so we can keep track of the last position
function* getFirstEmptyBlock() {
  for (let index = 0; index < diskSize; index++) {
    index = disk.indexOf(-1, index);
    if (index >= 0) yield index;
    else break;
  }
}
function* getLastFilledBlock() {
  for (let index = diskSize - 1; index >= 0; index--) {
    // We *could* use .findLastIndex but eh, not really a speed improvement
    const value = disk[index];
    if (value !== -1) yield index;
  }
}

let nextEmpty;
let lastFilled;
const nextEmptyIterator = getFirstEmptyBlock();
const lastFilledIterator = getLastFilledBlock();
while (true) {
  nextEmpty = nextEmptyIterator.next().value;
  lastFilled = lastFilledIterator.next().value
  // This means we've compacted all the blocks. This condition will surely
  // happen before we fully consume the iterators if there's at least one free
  // block (and of course there is...).
  if (lastFilled < nextEmpty) break;
  disk[nextEmpty] = disk[lastFilled];
  disk[lastFilled] = -1;
}

const checksum = disk.reduce((sum, value, index) => sum + (value >= 0 ? value * index : 0), 0);
console.log(checksum);
