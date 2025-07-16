import { parseGundamText } from "./parser.js";

// Test the specific card text
const cardText =
  "<Blocker> (Rest this Unit to change the attack target to it.)\n【When Paired･Lv.4 or Higher Pilot】Choose 1 enemy Unit with 4 or less HP. Return it to its owner's hand.\n";

console.log("Original text:", JSON.stringify(cardText));

// Clean the text like the test utils do
const cleanedText = cardText
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/<br>/g, "\n")
  .replace(/【(.+?)】/g, "【$1】\n")
  .trim();

console.log("Cleaned text:", JSON.stringify(cleanedText));

const result = parseGundamText(cleanedText, { debug: true });

console.log("\nParse result:");
console.log("Abilities:", result.abilities.length);
console.log("Errors:", result.errors);
console.log("Warnings:", result.warnings);

result.abilities.forEach((ability, i) => {
  console.log(`\nAbility ${i + 1}:`);
  console.log("  Type:", ability.type);
  console.log("  Text:", ability.text);
  console.log("  Effects:", ability.effects?.length || 0);
  if (ability.trigger) {
    console.log("  Trigger:", JSON.stringify(ability.trigger));
  }
  if (ability.effects) {
    ability.effects.forEach((effect, j) => {
      console.log(`  Effect ${j + 1}:`, JSON.stringify(effect));
    });
  }
});

if (result.clauses) {
  console.log("\nClauses Analysis:");
  result.clauses.forEach((clause, i) => {
    console.log(`\nClause ${i + 1}:`);
    console.log("  Type:", clause.type);
    console.log("  Text:", JSON.stringify(clause.text));
    console.log("  Effects:", clause.effects?.length || 0);
    if (clause.effects && clause.effects.length > 0) {
      clause.effects.forEach((effect, j) => {
        console.log(`    Effect ${j + 1}:`, JSON.stringify(effect));
      });
    }
  });
}
