const links = input.trim().split('\n').map((line) => line.split('-').sort());

const computerMap = links.reduce((map, [a, b]) => {
  if (a in map) map[a].push(b);
  else map[a] = [b];
  if (b in map) map[b].push(a);
  else map[b] = [a];
  return map;
}, {});

const computers = Object.keys(computerMap).sort();

const threeSets = computers.flatMap((computer) => {
  const list = computerMap[computer];
  const sets = [];
  list.forEach((neighbour, index) => {
    list.slice(index + 1).forEach((otherNeighbour) => {
      if (computerMap[neighbour].includes(otherNeighbour)) {
        sets.push([computer, neighbour, otherNeighbour].join('-'));
      }
    })
  });
  return sets;
});
// We divide by three because each sets is counted three times (once for each
// computer in the set)
console.log(threeSets.filter(set => /t[a-z]/.test(set)).length / 3);

const lanParties = [];
computers.forEach((pc) => {
  const includingParties = lanParties.filter((party) => party.every((computer) => computerMap[pc].includes(computer)));
  if (includingParties.length) includingParties.forEach((party) => party.push(pc));
  else lanParties.push([pc]);
});
const largestSize = Math.max(...lanParties.map((party) => party.length));
console.log(
  lanParties.find(party => party.length === largestSize).join()
);
