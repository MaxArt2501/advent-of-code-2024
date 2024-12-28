const [inputBlock, gateBlock] = input.trim().split('\n\n');

const wireNames = Array.from(new Set(input.match(/[a-z][a-z\d]{2}/g))).sort();
const wires = Object.fromEntries(wireNames.map(
  wireName => [wireName, { value: null, gates: [] }]
));

gateBlock.split('\n').forEach(line => {
  const [input1, type, input2, , output] = line.split(' ');
  const gate = { type, inputs: [input1, input2], output };
  wires[input1].gates.push(gate);
  wires[input2].gates.push(gate);
});

// OOOOH BOY now we need to verify that a 45-bit full-adder is correctly
// implemented?!
// Ok, let's name some things:
//     an = xn & yn
//     sn = xn ^ yn
// In a full-adder, the carry flag cn for bit n is given by:
//     cn = an | (cn-1 & sn) = an | rn
// The n-th result bit zn is given by:
//     zn = sn ^ cn-1
// Exception are when n is the first bit (where c00 = a00 and z00 = s00) or the
// last bit (where zn = cn-1).
const getWiresWith = letter => wireNames.filter(wire => wire.startsWith(letter));
const xWires = getWiresWith('x');
const yWires = getWiresWith('y');
const zWires = getWiresWith('z');
const aWires = [];
const sWires = [];
const rWires = [null];
const cWires = [];

// Rather than trying to find pairs of swapped outputs, we're going to find
// every incorrect wire.
const incorrect = [];
xWires.forEach((wireName, n) => {
  // This *should* be always correct, as the problem states that only *outputs*
  // have been swapped
  const { AND: [andGate], XOR: [xorGate] } = Object.groupBy(wires[wireName].gates, gate => gate.type);

  aWires[n] = andGate.output;
  sWires[n] = xorGate.output;

  if (n === 0) {
    cWires[n] = aWires[n];
    // s00 must be z00
    if (xorGate.output !== 'z00') incorrect.push(xorGate.output);
    return;
  }

  // If n > 0, sn must *not* be zn
  if (sWires[n].startsWith('z')) incorrect.push(sWires[n]);

  const sGates = wires[sWires[n]].gates;
  // sn must be connected to an AND gate and a XOR gate
  if (sGates.map(gate => gate.type).sort().join() !== 'AND,XOR') incorrect.push(sWires[n]);
  else {
    for (const gate of sGates) {
      if (gate.type === 'AND') {
        rWires[n] = gate.output;
        // rn must not be zn
        if (gate.output.startsWith('z')) incorrect.push(gate.output);
        else {
          const rGates = wires[gate.output].gates;
          // rn must be put on OR with cn-1 (to obtain cn)
          if (rGates.length !== 1 || rGates[0].type !== 'OR') incorrect.push(gate.output);
          else {
            cWires[n] = rGates[0].output;
            if (
              // Normally cn shouldn't be zn...
              cWires[n].startsWith('z') && n < xWires.length - 1 ||
              // ... unless we're on the last bit, where it should be zn+1
              n === xWires.length - 1 && cWires[n] !== 'z' + (n + 1) // Pardon the type coercion
            ) incorrect.push(cWires[n]);
          }
        }
      } else if (gate.type === 'XOR') {
        // sn XOR cn-1 must be zn
        if (gate.output !== 'z' + wireName.slice(1)) incorrect.push(gate.output);
      };
    }
  }

  // an must be put on OR with rn
  if (wires[aWires[n]].gates.length !== 1 || wires[aWires[n]].gates[0].type !== 'OR') incorrect.push(aWires[n]);
});

console.log(incorrect.sort().join());
