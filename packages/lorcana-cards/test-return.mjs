const text = "Return chosen character to their player's hand";
const pattern = /return\s+(.+?)\s+to\s+(?:your\s+|their\s+|player's)?hand/i;
const match = text.match(pattern);

console.log("Text:", text);
console.log("Pattern:", pattern);
console.log("Match:", match);
if (match) {
  console.log("Match[1]:", match[1]);
}
