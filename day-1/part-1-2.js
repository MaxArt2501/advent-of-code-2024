// First, we parse the input, splitting the number pairs into two lists.
const lists = input.split('\n').reduce(
  ([list1, list2], line) => {
    const nums = line.split('   ').map(Number);
    list1.push(nums[0]);
    list2.push(nums[1]);
    return [list1, list2];
  },
  [[], []]
);

// It doesn't matter if they're ordered for the second part, so we do it anyway
lists.forEach((list) => list.sort((a, b) => a - b));

console.log(
  lists[0].reduce((sum, num, index) => sum + Math.abs(num - lists[1][index]), 0)
);

console.log(
  // Filtering at each iteration isn't efficient but eh, it does its job quick enough
  lists[0].reduce((sum, num) => sum + num * lists[1].filter((n) => n === num).length, 0)
);
