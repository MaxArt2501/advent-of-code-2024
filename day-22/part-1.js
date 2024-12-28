const secrets = input.trim().split('\n').map(Number);
const PRUNE_VALUE = 16777215;

// At this point, I don't think there's much to say. Just do the thing.
const evolve = secret => {
  let value = secret;
  for (let count = 0; count < 2000; count++) {
    value = ((value << 6) ^ value) & PRUNE_VALUE;
    value = ((value >> 5) ^ value) & PRUNE_VALUE;
    value = ((value << 11) ^ value) & PRUNE_VALUE;
  }
  return value;
};

console.log(secrets.reduce((total, secret) => total + evolve(secret), 0));
