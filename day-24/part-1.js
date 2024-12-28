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

const operands = {
  'AND': (a, b) => a & b,
  'OR': (a, b) => a | b,
  'XOR': (a, b) => a ^ b
};

// This allows us to execute the connected gates if all inputs have a value
const setWire = (wireName, value) => {
  wires[wireName].value = value;
  wires[wireName].gates.forEach(execGate);
};

const execGate = (gate) => {
  if (gate.inputs.every(wireName => wires[wireName].value !== null)) {
    setWire(gate.output, operands[gate.type](...gate.inputs.map(wire => wires[wire].value)));
  }
};

for (const line of inputBlock.split('\n')) {
  const [wireName, value] = line.split(': ');
  setWire(wireName, Number(value));
}

const zWires = wireNames.filter(wire => wire.startsWith('z'));
console.log(zWires.reduce((sum, wireName, index) => sum + wires[wireName].value * 2 ** index, 0));
