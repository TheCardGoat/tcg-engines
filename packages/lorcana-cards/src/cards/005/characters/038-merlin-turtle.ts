import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinTurtle: CharacterCard = {
  id: "1ed",
  cardType: "character",
  name: "Merlin",
  version: "Turtle",
  fullName: "Merlin - Turtle",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "GIVE ME TIME TO THINK When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 38,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b59a5b35d2109955f13256931685e835cd3a6b47",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenPlayAndWhenLeaves } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { putOneOnTheTopAndTheOtherOnTheBottomOfYourDeck } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const merlinTurtle: LorcanitoCharacterCard = {
//   id: "h8i",
//   missingTestCase: true,
//   name: "Merlin",
//   title: "Turtle",
//   characteristics: ["sorcerer", "storyborn", "mentor"],
//   text: "**GIVE ME TIME TO THINK** When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
//   type: "character",
//   abilities: whenPlayAndWhenLeaves({
//     name: "Give me time to think",
//     text: "When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
//     effects: [putOneOnTheTopAndTheOtherOnTheBottomOfYourDeck],
//   }),
//   flavour: "Don't rush me, now—this is important.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Andrea Femerstrand",
//   number: 38,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561951,
//   },
//   rarity: "common",
// };
//
