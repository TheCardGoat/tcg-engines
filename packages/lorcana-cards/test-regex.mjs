const newPattern =
  /return\s+(.+?)\s+to\s+(?:(?:your|their|player's)(?:\s+player's)?\s+)?hand/i;

const tests = [
  "Return chosen character to their player's hand",
  "Return chosen character to their hand",
  "Return chosen character to your hand",
  "Return chosen character to player's hand",
  "return chosen character to hand",
];

for (const test of tests) {
  const match = test.match(newPattern);
  console.log(`Test: "${test}"`);
  console.log("Match:", match ? match[1] : "NO MATCH");
  console.log("---");
}
