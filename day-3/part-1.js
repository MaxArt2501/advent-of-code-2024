// Yeah, regex time!
const matcher = /mul\((\d+),(\d+)\)/g;
// The new .matchAll() method returns an iterator, so we need Array.from
const products = Array.from(input.matchAll(matcher), ([, a, b]) => a * b);
console.log(products.reduce((sum, num) => sum + num));
