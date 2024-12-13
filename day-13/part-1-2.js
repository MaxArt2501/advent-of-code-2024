const machines = input.trim().split('\n\n').map(block => block.match(/\d+/g).map(Number));

const getTokens = ([ax, ay, bx, by, px, py]) => {
  // PSA: there is no "cheapest way" to win the prize! There is *one* way, or
  // there is not. Because it comes from this system of equations:
  //    { ax * aTimes + bx * bTimes = px
  //      ay * aTimes + by * bTimes = py }
  // which has only one solution for aTimes and bTimes. We check if they are
  // integers, and we're done.
  const bTimes = (ax * py - ay * px) / (ax * by - ay * bx);
  const aTimes = (px - bx * bTimes) / ax;
  return Number.isInteger(aTimes) && Number.isInteger(bTimes) ? aTimes * 3 + bTimes : 0;
};

const getTotalTokens = machines => machines.reduce((sum, machine) => sum + getTokens(machine), 0);

console.log(getTotalTokens(machines));
console.log(getTotalTokens(machines.map(([ax, ay, bx, by, px, py]) => [ax, ay, bx, by, px + 1e13, py + 1e13])));
