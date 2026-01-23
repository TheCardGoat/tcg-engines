import type { CharacterCard } from "@tcg/lorcana-types";

export const kenaiMagicalBear: CharacterCard = {
  id: "wwk",
  cardType: "character",
  name: "Kenai",
  version: "Magical Bear",
  fullName: "Kenai - Magical Bear",
  inkType: ["amethyst"],
  franchise: "Brother Bear",
  set: "007",
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)\nWISDOM OF HIS STORY During your turn, when this character is banished in a challenge, return this card to your hand and gain 1 lore.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 70,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7696e481f25492ef90ec0b0ac819144fbe6fcffa",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { challengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import {
//   returnThisCardToHand,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const kenaiMagicalBear: LorcanitoCharacterCard = {
//   id: "upm",
//   name: "Kenai",
//   title: "Magical Bear",
//   characteristics: ["storyborn", "hero"],
//   text: "Challenger +2. WISDOM OF HIS STORY During your turn, when this character is banished in a challenge, return this card to your hand and gain 1 lore.",
//   type: "character",
//   abilities: [
//     challengerAbility(2),
//     whenThisCharacterBanishedInAChallenge({
//       name: "Durable",
//       optional: true,
//       text: "During your turn, when this character is banished in a challenge, return this card to your hand and gain 1 lore.",
//       conditions: [
//         {
//           type: "during-turn",
//           value: "self",
//         },
//       ],
//       effects: [returnThisCardToHand, youGainLore(1)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 1,
//   willpower: 4,
//   illustrator: "Jeanne Plounevez",
//   number: 70,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618326,
//   },
//   rarity: "rare",
//   lore: 1,
// };
//
