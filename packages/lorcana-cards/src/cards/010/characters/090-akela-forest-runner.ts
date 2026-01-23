import type { CharacterCard } from "@tcg/lorcana-types";

export const akelaForestRunner: CharacterCard = {
  id: "10m",
  cardType: "character",
  name: "Akela",
  version: "Forest Runner",
  fullName: "Akela - Forest Runner",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "010",
  text: "AHEAD OF THE PACK 1 {I} — This character gets +1 {S} this turn.",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 90,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "84044f2f05a69ebe3e2cb39c3ba18b5c1528ed01",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const akelaForestRunner: LorcanitoCharacterCard = {
//   id: "vzx",
//   name: "Akela",
//   title: "Forest Runner",
//   characteristics: ["storyborn", "ally"],
//   text: "AHEAD OF THE PACK 1 {I} — This character gets +1 {S} this turn.",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 2,
//   willpower: 5,
//   illustrator: "Shawn Ivan",
//   number: 90,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659186,
//   },
//   rarity: "common",
//   abilities: [
//     {
//       type: "activated",
//       name: "AHEAD OF THE PACK",
//       text: "1 {I} — This character gets +1 {S} this turn.",
//       costs: [{ type: "ink", amount: 1 }],
//       effects: [thisCharacterGetsStrength(1)],
//     },
//   ],
//   lore: 1,
// };
//
