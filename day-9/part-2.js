const lengths = Uint8Array.from(input.trim(), (c) => +c);
const diskSize = lengths.reduce((sum, length) => sum + length);
const disk = new Int16Array(diskSize);

let pos = 0;
// Now we also keep track of the empty chunks and the files
const files = [];
const emptyChunks = [];
lengths.forEach((length, index) => {
  const isEmptyChunk = index & 1;
  const filler = isEmptyChunk ? -1 : (index >> 1);
  disk.set(new Int16Array(length).fill(filler), pos);
  const list = isEmptyChunk ? emptyChunks : files;
  list.push({ pos, length });
  pos += length;
});

// If you're wondering why, in the given example, we couldn't move the `8888`
// file, it's because when it was its turn to be moved, there was no available
// space to the left of it *at that moment*. In fact, the text says:
// > If there is no span of free space to the left of a file that is large
// > enough to fit the file, the file does not move.

for (let index = files.length - 1; index >= 0; index--) {
  const { pos, length: fileSize } = files[index];
  const emptyChunk = emptyChunks.find(({ length }) => length >= fileSize);
  // We need this check, otherwise we might move a file *to the right* and not
  // to the left
  if (emptyChunk?.pos < pos) {
    disk.copyWithin(emptyChunk.pos, pos, pos + fileSize);
    disk.fill(-1, pos, pos + fileSize);
    emptyChunk.pos += fileSize;
    emptyChunk.length -= fileSize;
  }
}

const checksum = disk.reduce((sum, value, index) => sum + (value >= 0 ? value * index : 0), 0);
console.log(checksum);
