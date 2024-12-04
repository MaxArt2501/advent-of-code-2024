// This part is actually simpler, once we conceinved the regexes in part 1.
// Just remember to match only one character, then use lookaheads.
const matchers = [
  /M(?=.M[\s\S]{139}A[\s\S]{139}S.S)/g,
  /M(?=.S[\s\S]{139}A[\s\S]{139}M.S)/g,
  /S(?=.M[\s\S]{139}A[\s\S]{139}S.M)/g,
  /S(?=.S[\s\S]{139}A[\s\S]{139}M.M)/g,
];
console.log(matchers.reduce(
  (total, matcher) => total + input.match(matcher).length, 0
));
