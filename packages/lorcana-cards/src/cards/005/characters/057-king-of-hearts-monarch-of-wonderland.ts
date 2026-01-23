import type { CharacterCard } from "@tcg/lorcana-types";

export const kingOfHeartsMonarchOfWonderland: CharacterCard = {
  id: "3sp",
  cardType: "character",
  name: "King of Hearts",
  version: "Monarch of Wonderland",
  fullName: "King of Hearts - Monarch of Wonderland",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "005",
  text: "PLEASING THE QUEEN {E} — Chosen exerted character can't ready at the start of their next turn.",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 57,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0daff0afef432846506fd1740303222ded737937",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { exertedCharCantReadyNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const kingOfHeartsMonarchOfWonderland: LorcanitoCharacterCard = {
//   id: "ss4",
//   missingTestCase: true,
//   name: "King of Hearts",
//   title: "Monarch of Wonderland",
//   characteristics: ["storyborn", "ally", "king"],
//   text: "**PLEASING THE QUEEN** {E} – Chosen exerted character can’t ready at the start of their next turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       name: "Pleasing The Queen",
//       text: "{E} – Chosen exerted character can’t ready at the start of their next turn.",
//       costs: [{ type: "exert" }],
//       effects: [exertedCharCantReadyNextTurn],
//     },
//   ],
//   flavour: "By order of the king. You heard what she said!",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 1,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Brittney Hackett",
//   number: 57,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561490,
//   },
//   rarity: "uncommon",
// };
//
