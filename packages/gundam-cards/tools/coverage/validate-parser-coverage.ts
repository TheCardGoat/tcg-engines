import type { Effect } from "@tcg/gundam-types";
import { GD01, ST01, ST02, ST03, ST04, ST05 } from "../../src";
import { parseCardText } from "../parser/text-parser";

const allSets = [GD01, ST01, ST02, ST03, ST04, ST05];
let totalCards = 0;
let totalEffects = 0;
let customEffects = 0;
let structuredEffects = 0;
let partiallyStructuredEffects = 0;

const unparsedPatterns: Record<string, number> = {};

console.log("Starting Parser Coverage Validation...");

const allCards = allSets.flatMap((set) => Object.values(set));

for (const card of allCards) {
  // Check if card is a valid object and has text
  if (!card || typeof card !== "object" || !("text" in card) || !card.text)
    continue;

  totalCards++;
  const result = parseCardText(card.text);

  for (const effect of result.effects) {
    totalEffects++;

    // Check if action is CUSTOM or action.type is CUSTOM
    if (effect.action.type === "CUSTOM") {
      customEffects++;
      const text = effect.action.text || "";
      // Simple pattern clustering (first 5 words)
      const pattern = text.split(" ").slice(0, 5).join(" ");
      unparsedPatterns[pattern] = (unparsedPatterns[pattern] || 0) + 1;
    } else {
      // Check if target is unknown (partially structured)
      // Current parser's parseTarget returns object that might be put into parameters.target
      const action = effect.action as any;
      const target = action.parameters?.target || action.target;

      if (target && target.type === "unknown") {
        partiallyStructuredEffects++;
      } else {
        structuredEffects++;
      }
    }
  }
}

console.log("\n=== Coverage Report ===");
console.log(`Total Cards with Text: ${totalCards}`);
console.log(`Total Effects: ${totalEffects}`);
console.log(
  `Structured: ${structuredEffects} (${((structuredEffects / totalEffects) * 100).toFixed(1)}%)`,
);
console.log(
  `Partially Structured (Unknown Target): ${partiallyStructuredEffects} (${((partiallyStructuredEffects / totalEffects) * 100).toFixed(1)}%)`,
);
console.log(
  `Custom (Fallback): ${customEffects} (${((customEffects / totalEffects) * 100).toFixed(1)}%)`,
);

console.log("\n=== Top Unparsed Patterns ===");
const sortedPatterns = Object.entries(unparsedPatterns)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 20);

for (const [pattern, count] of sortedPatterns) {
  console.log(`${count}x: ${pattern}...`);
}
