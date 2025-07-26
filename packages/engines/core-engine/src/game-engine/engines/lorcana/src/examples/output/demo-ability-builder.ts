#!/usr/bin/env bun

/**
 * This is a demo script that demonstrates the functionality of the ability builder.
 * Run with: bun src/game-engine/engines/lorcana/src/examples/demo-ability-builder.ts
 */

import chalk from "chalk";
import { AbilityBuilder } from "../../abilities/builder/ability-builder";
import { demonstrateAbilityParsing } from "./ability-type-examples";

// Run the basic ability parsing demonstration
demonstrateAbilityParsing();

// Additional examples with card text from real cards
console.log(chalk.bold("\n=== REAL CARD EXAMPLES ==="));

// Example cards from Lorcana
const realCardExamples = [
  {
    name: "Ursula - Deceiver of All",
    ability: "What a Deal",
    text: "Whenever this character sings a song, you may play that song again from your discard for free. If you do, put that card on the bottom of your deck instead of into your discard.",
  },
  {
    name: "Mickey Mouse - Brave Little Tailor",
    ability: "Giant Slayer",
    text: "When this character challenges a character with 6 {S} or more, he gets +5 {S} until end of turn.",
  },
  {
    name: "Moana - Of Motunui",
    ability: "We Can Fix It",
    text: "Whenever this character quests, you may ready your other Princess characters. They can't quest for the rest of this turn.",
  },
  {
    name: "Stitch - Carefree Surfer",
    ability: "Ohana",
    text: "When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
  },
  {
    name: "Scar - Vicious Cheater",
    ability: "Daddy Isn't Here to Save You",
    text: "During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.",
  },
  {
    name: "John Silver - Alien Pirate",
    ability: "Pick Your Fights",
    text: "When you play this character and whenever he quests, chosen opposing character gains Reckless during their next turn.",
  },
];

// Process and display each real card example
for (const [index, card] of realCardExamples.entries()) {
  console.log(chalk.cyan(`\n${index + 1}. ${card.name} - ${card.ability}:`));
  console.log(chalk.yellow(`Text: "${card.text}"`));

  const ability = AbilityBuilder.fromText(card.text)[0];

  console.log(chalk.green("Parsed ability:"));
  console.log(JSON.stringify(ability, null, 2));
}

// Interactive testing section (enable if needed)
/*
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(chalk.bold("\n=== INTERACTIVE ABILITY PARSER ==="));
console.log("Type a card ability text to parse it (or 'exit' to quit):");

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    rl.close();
    return;
  }
  
  console.log(chalk.yellow(`\nParsing: "${input}"`));
  const ability = AbilityBuilder.buildAbility(input);
  console.log(chalk.green("Result:"));
  console.log(JSON.stringify(ability, null, 2));
  console.log(chalk.cyan("\nEnter another ability text (or 'exit' to quit):"));
});
*/
