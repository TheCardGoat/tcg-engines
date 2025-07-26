import { AbilityBuilder } from "../abilities/builder/ability-builder";

/**
 * This file demonstrates how to use the AbilityBuilder to parse card text into structured ability objects
 */

// Example card texts
const exampleCardTexts = {
  activatedAbility: "{E} — Chosen character gets +2 {S} this turn.",
  triggeredAbility: "When you play this character, gain 1 lore.",
  staticAbility: "Your exerted characters gain Ward.",
  keywordAbility:
    "Evasive (Only characters with Evasive can challenge this character.)",
  complexAbility: "Whenever this character quests, you may draw a card.",
  damageAbility: "{E} — Deal 2 damage to chosen character.",
  banishAbility:
    "Banish chosen item of yours to deal 5 damage to chosen character.",
  conditionalAbility:
    "When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
  multipleEffects:
    "Whenever this character quests, chosen opposing character gets -2 {S} this turn and chosen character gets +2 {S} this turn.",
  keywordGrant: "{E} — Chosen character gains Rush this turn.",
  songAbility:
    "(A character with cost 4 or more can {E} to sing this song for free.) Draw 2 cards, then choose and discard a card.",
  shiftAbility:
    "Shift 2 (You may banish a character you control with ink cost 2 or less when you play this character and put it beneath this character. This character counts as being named both Stitch and the banished character.)",
};

// Demonstrate parsing different ability types
export function demonstrateAbilityParsing(): void {
  console.log("=== ABILITY PARSING DEMONSTRATION ===");

  console.log("\n1. Activated Ability Example:");
  const activatedAbility = AbilityBuilder.fromText(
    exampleCardTexts.activatedAbility,
  )[0];
  console.log(JSON.stringify(activatedAbility, null, 2));

  console.log("\n2. Triggered Ability Example:");
  const triggeredAbility = AbilityBuilder.fromText(
    exampleCardTexts.triggeredAbility,
  )[0];
  console.log(JSON.stringify(triggeredAbility, null, 2));

  console.log("\n3. Static Ability Example:");
  const staticAbility = AbilityBuilder.fromText(
    exampleCardTexts.staticAbility,
  )[0];
  console.log(JSON.stringify(staticAbility, null, 2));

  console.log("\n4. Keyword Ability Example:");
  const keywordAbility = AbilityBuilder.fromText(
    exampleCardTexts.keywordAbility,
  )[0];
  console.log(JSON.stringify(keywordAbility, null, 2));

  console.log("\n5. Complex Ability with Optional Effect:");
  const complexAbility = AbilityBuilder.fromText(
    exampleCardTexts.complexAbility,
  )[0];
  console.log(JSON.stringify(complexAbility, null, 2));

  console.log("\n6. Damage Dealing Ability:");
  const damageAbility = AbilityBuilder.fromText(
    exampleCardTexts.damageAbility,
  )[0];
  console.log(JSON.stringify(damageAbility, null, 2));

  console.log("\n7. Ability with Cost:");
  const banishAbility = AbilityBuilder.fromText(
    exampleCardTexts.banishAbility,
  )[0];
  console.log(JSON.stringify(banishAbility, null, 2));

  console.log("\n8. Conditional Ability:");
  const conditionalAbility = AbilityBuilder.fromText(
    exampleCardTexts.conditionalAbility,
  )[0];
  console.log(JSON.stringify(conditionalAbility, null, 2));

  console.log("\n9. Multiple Effects Ability:");
  const multipleEffects = AbilityBuilder.fromText(
    exampleCardTexts.multipleEffects,
  )[0];
  console.log(JSON.stringify(multipleEffects, null, 2));

  console.log("\n10. Keyword Grant Ability:");
  const keywordGrant = AbilityBuilder.fromText(
    exampleCardTexts.keywordGrant,
  )[0];
  console.log(JSON.stringify(keywordGrant, null, 2));
}

// Run the demonstration
// Uncomment to run: demonstrateAbilityParsing();
