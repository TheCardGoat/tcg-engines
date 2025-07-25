/**
 * This script tests the ability mapping functionality by analyzing card texts and
 * categorizing them by ability type.
 */

import {
  getCardTextsByAbilityType,
  getFullCardTextAnalysis,
  getUncategorizedCardTexts,
} from "./analyze-card-text";

// Run the analysis
const analysis = getFullCardTextAnalysis();

console.log("=== Lorcana Card Text Analysis ===");
console.log(`Total card texts analyzed: ${analysis.total}`);
console.log("\nAbility Type Distribution:");
console.log(`- Activated abilities: ${analysis.byType.activated}`);
console.log(`- Triggered abilities: ${analysis.byType.triggered}`);
console.log(`- Static abilities: ${analysis.byType.static}`);
console.log(`- Keyword abilities: ${analysis.byType.keyword}`);
console.log(`- Replacement abilities: ${analysis.byType.replacement}`);
console.log(`- Uncategorized: ${analysis.byType.unknown}`);

console.log("\nPattern Frequency:");
console.log(`- Has cost: ${analysis.patterns.hasCost}`);
console.log(`- Has immediate effect: ${analysis.patterns.hasImmediateEffect}`);
console.log(
  `- Has trigger condition: ${analysis.patterns.hasTriggerCondition}`,
);
console.log(`- Has keyword: ${analysis.patterns.hasKeyword}`);
console.log(`- Has condition: ${analysis.patterns.hasCondition}`);
console.log(`- Has duration: ${analysis.patterns.hasDuration}`);
console.log(`- Has target: ${analysis.patterns.hasTarget}`);

// Display examples of each ability type
const abilityTypes = [
  "activated",
  "triggered",
  "static",
  "keyword",
  "replacement",
] as const;

for (const type of abilityTypes) {
  const examples = getCardTextsByAbilityType(type);
  console.log(`\n=== Example ${type} abilities (${examples.length}) ===`);
  examples.slice(0, 5).forEach((text, index) => {
    console.log(`${index + 1}. ${text}`);
  });

  if (examples.length > 5) {
    console.log(`... and ${examples.length - 5} more.`);
  }
}

// Display examples of uncategorized texts
const uncategorized = getUncategorizedCardTexts();
console.log(`\n=== Uncategorized ability texts (${uncategorized.length}) ===`);
uncategorized.slice(0, 10).forEach((text, index) => {
  console.log(`${index + 1}. ${text}`);
});

if (uncategorized.length > 10) {
  console.log(`... and ${uncategorized.length - 10} more.`);
}

console.log("\n=== Analysis Complete ===");

/**
 * This function can be used to manually test specific card text examples
 */
function testSpecificCardTexts() {
  const testTexts = [
    "{E} – Chosen character gets +3 {S} this turn.",
    "When you play this character, gain 1 lore.",
    "This character can't be challenged.",
    "Rush",
    "If an effect would cause you to discard one or more cards, you don't discard.",
    // Add more specific examples here
  ];

  console.log("\n=== Testing Specific Card Texts ===");
  testTexts.forEach((text) => {
    const analysis = getFullCardTextAnalysis();
    console.log(`\nText: "${text}"`);
    console.log(`Detected ability type: ${analysis.byType || "unknown"}`);
  });
}

// Uncomment to run specific tests
// testSpecificCardTexts();
