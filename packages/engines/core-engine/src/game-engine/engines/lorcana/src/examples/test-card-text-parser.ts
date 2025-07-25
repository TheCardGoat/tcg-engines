/**
 * This script tests the CardTextParser class with various card text examples.
 */

import { CardTextParser } from "./card-text-parser";

// Test card texts representing different ability types
const testCards = [
  // Activated abilities
  "{E} – Chosen character gets +3 {S} this turn.",
  "{E}, 1 {I} – Chosen character gains Challenger +2 this turn.",
  "{E}, Banish one of your items – Draw a card.",

  // Triggered abilities
  "When you play this character, gain 1 lore.",
  "Whenever this character quests, chosen opposing character gets -2 {S} until the start of your next turn.",
  "At the start of your turn, if this character has no damage, draw a card.",

  // Static abilities
  "This character gets +1 {S} for each other character you have in play.",
  "While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
  "This character can't be challenged.",

  // Keyword abilities
  "Rush",
  "Challenger +2",
  "Shift 3",
  "Evasive (Only characters with Evasive can challenge this character.)",

  // Replacement effects
  "If an effect would cause you to discard one or more cards, you don't discard.",
  "Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.",

  // Complex multi-ability texts
  "Evasive (Only characters with Evasive can challenge this character.)\nWhen you play this character, gain 1 lore.",
  "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Bruno Madrigal.)\nBRIGHT FUTURE Whenever this character sings a song, you may draw a card for each character you have in play.",
  "WELCOME EXTRAVAGANCE Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
  "Bodyguard\nTHE BIGGEST STAR EVER When this character is banished, deal 5 damage to each opposing character.",
];

console.log("=== CardTextParser Tests ===\n");

// Test 1: Basic ability type detection
console.log("Test 1: Basic ability type detection");
testCards.forEach((text, index) => {
  const parsedAbility = CardTextParser.parseAbility(text);
  console.log(
    `Card ${index + 1}: "${text.substring(0, 50)}${text.length > 50 ? "..." : ""}" -> ${parsedAbility.abilityType || "unknown"}`,
  );
});

// Test 2: Multi-ability parsing
console.log("\nTest 2: Multi-ability parsing");
const multiAbilityCards = testCards.slice(-4); // Get the last 4 complex examples
multiAbilityCards.forEach((text, index) => {
  const parsedAbilities = CardTextParser.parseCardText(text);
  console.log(
    `\nComplex Card ${index + 1}: "${text.substring(0, 50)}${text.length > 50 ? "..." : ""}"`,
  );
  parsedAbilities.forEach((ability, i) => {
    console.log(
      `  Ability ${i + 1}: "${ability.text.substring(0, 40)}${ability.text.length > 40 ? "..." : ""}" -> ${ability.abilityType || "unknown"}`,
    );
  });
});

// Test 3: Keyword extraction
console.log("\nTest 3: Keyword extraction");
const keywordCards = [
  "Rush",
  "Evasive",
  "Challenger +2",
  "Shift 3",
  "Bodyguard (This character may enter play exerted.)",
  "Evasive\nSupport",
  "Rush\nResist +2\nEvasive",
];

keywordCards.forEach((text, index) => {
  const keywords = CardTextParser.extractKeywords(text);
  console.log(
    `Card ${index + 1}: "${text}" -> Keywords: ${keywords.join(", ")}`,
  );
});

// Test 4: Ability properties detection
console.log("\nTest 4: Ability properties detection");
const propertiesTestCards = [
  {
    text: "{E} – Chosen character gets +3 {S} this turn.",
    desc: "Has cost, target, and duration",
  },
  {
    text: "If you have a character named Minnie Mouse in play, this character gets +2 {S}.",
    desc: "Has condition",
  },
  {
    text: "Deal 1 damage to each opposing character.",
    desc: "Has target, no cost/condition/duration",
  },
  {
    text: "While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.",
    desc: "Has condition",
  },
];

propertiesTestCards.forEach((item, index) => {
  const parsedAbility = CardTextParser.parseAbility(item.text);
  console.log(`\nCard ${index + 1}: "${item.text}" (${item.desc})`);
  console.log(`  - Type: ${parsedAbility.abilityType || "unknown"}`);
  console.log(`  - Has cost: ${parsedAbility.hasCost}`);
  console.log(`  - Has target: ${parsedAbility.hasTarget}`);
  console.log(`  - Has condition: ${parsedAbility.hasCondition}`);
  console.log(`  - Has duration: ${parsedAbility.hasDuration}`);
});

console.log("\n=== Tests Complete ===");
