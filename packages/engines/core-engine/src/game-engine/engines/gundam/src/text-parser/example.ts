// Example usage of the Gundam Text Parser

import {
  extractEffectsFromText,
  generateAbilitiesFromText,
  normalizeText,
  parseGundamText,
  parseTargetFromText,
  VERSION,
} from "./index";

console.log(`Gundam Text Parser v${VERSION}`);

// Simple parsing examples
function runExamples() {
  const examples = [
    "Deal 2 damage to target enemy unit.",
    "Draw 2 cards.",
    "Deploy a unit from your hand.",
    "Target friendly unit gets +3 power until end of turn.",
    "Choose one: Deal 2 damage to target unit or draw a card.",
    "When this unit attacks, draw a card.",
    "At the end of your turn, deal 1 damage to all enemy units.",
    "Friendly units with <Repair> get +1 power.",
    "Units with power 3 or less cannot attack this turn.",
  ];

  console.log("\n=== GUNDAM TEXT PARSER EXAMPLES ===\n");

  examples.forEach((text, index) => {
    console.log(`\nExample ${index + 1}: "${text}"`);

    // Step 1: Text normalization
    const normalized = normalizeText(text);
    console.log(`Normalized: "${normalized}"`);

    // Step 2: Extract effects
    const effects = extractEffectsFromText(normalized);
    console.log(`Found ${effects.length} effects`);

    // Step 3: Parse target text if present
    if (effects.length > 0 && effects[0].parameters.targetText) {
      const targetText = effects[0].parameters.targetText;
      const target = parseTargetFromText(targetText);
      console.log(
        `Target: ${targetText} -> ${target ? JSON.stringify(target) : "unknown"}`,
      );
    }

    // Step 4: Complete parsing
    const result = parseGundamText(text);

    // Step 5: Show results
    console.log(`Generated ${result.abilities.length} abilities`);
    if (result.warnings.length > 0) {
      console.log(`Warnings: ${result.warnings.join(", ")}`);
    }
    if (result.errors.length > 0) {
      console.log(`Errors: ${result.errors.join(", ")}`);
    }

    console.log("---------------");
  });
}

// Run detailed analysis on a single card text
function analyzeCard(cardText: string) {
  console.log("\n=== DETAILED ANALYSIS ===\n");
  console.log(`Analyzing: "${cardText}"`);

  const result = parseGundamText(cardText, { debug: true });

  console.log("\nGenerated abilities:");
  result.abilities.forEach((ability, index) => {
    console.log(`\nAbility ${index + 1}:`);
    console.log(`- Type: ${ability.type}`);
    console.log(`- Effects: ${ability.effects.length}`);
    console.log(`- Text: ${ability.text || "(none)"}`);

    // Log more details about effects
    ability.effects.forEach((effect, effectIndex) => {
      console.log(`  - Effect ${effectIndex + 1}: ${effect.type}`);
    });
  });

  return result;
}

// Main function
function main() {
  // Run simple examples
  runExamples();

  // Run detailed analysis on a complex card
  const complexCard =
    "When this unit is deployed, draw a card. <Repair> (When this unit is destroyed, return it to your hand.)";
  analyzeCard(complexCard);
}

// Execute
main();

// Example of programmatic usage
export function parseGundamCardText(cardText: string) {
  return generateAbilitiesFromText(cardText);
}
