const pattern = /choose\s+one[\s:−—-]+/i;
const test1 = "Choose one: Draw a card. Do something unparsable.";
const test2 = "Choose one: Draw a card";

console.log(`Test 1: "${test1}"`);
console.log("Match:", pattern.test(test1));

console.log(`\nTest 2: "${test2}"`);
console.log("Match:", pattern.test(test2));
