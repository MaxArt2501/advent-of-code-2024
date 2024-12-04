// I KNOW I'm abusing regexes today! But better than crawling the input for all
// the possible displacements of 'XMAS'...
const matchers = [
  // For words that spans over multiple lines, we need to use lookaheads, since
  // they don't "eat" the input like usual matches do. We're assuming that each
  // line of the input is 140 characters long (as in my case).
  // The first regex means, "S, only if followed by: 141 characters (including
  // newlines) that we don't care about, then A, then 141 chars, then M, then
  // 141 chars, then X". It should catch the word 'XMAS' written towards the
  // bottom right of the field.
  /S(?=[\s\S]{141}A[\s\S]{141}M[\s\S]{141}X)/g,
  /S(?=[\s\S]{140}A[\s\S]{140}M[\s\S]{140}X)/g,
  /S(?=[\s\S]{139}A[\s\S]{139}M[\s\S]{139}X)/g,
  /SAMX/g,
  /XMAS/g,
  /X(?=[\s\S]{139}M[\s\S]{139}A[\s\S]{139}S)/g,
  /X(?=[\s\S]{140}M[\s\S]{140}A[\s\S]{140}S)/g,
  /X(?=[\s\S]{141}M[\s\S]{141}A[\s\S]{141}S)/g,
];
console.log(matchers.reduce(
  (total, matcher) => total + input.match(matcher).length, 0
));
