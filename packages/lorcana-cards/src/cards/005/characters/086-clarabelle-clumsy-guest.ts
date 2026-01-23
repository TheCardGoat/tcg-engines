import type { CharacterCard } from "@tcg/lorcana-types";

export const clarabelleClumsyGuest: CharacterCard = {
  id: "o3x",
  cardType: "character",
  name: "Clarabelle",
  version: "Clumsy Guest",
  fullName: "Clarabelle - Clumsy Guest",
  inkType: ["emerald"],
  set: "005",
  text: "BUTTERFINGERS When you play this character, you may pay 2 {I} to banish chosen item.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 86,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "56e43daa6eaf47b0b2ce42f58aa299b1b4b1be91",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { banishChosenItem } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const clarabelleClumsyGuest: LorcanitoCharacterCard = {
//   id: "ws8",
//   missingTestCase: true,
//   name: "Clarabelle",
//   title: "Clumsy Guest",
//   characteristics: ["storyborn", "ally"],
//   text: "**BUTTERFINGER** When you play this character, you may pay to 2 {I} to banish chosen item.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       optional: true,
//       costs: [{ type: "ink", amount: 2 }],
//       name: "BUTTERFINGER",
//       text: "When you play this character, you may pay to 2 {I} to banish chosen item.",
//       effects: [banishChosenItem],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Kenneth Anderson",
//   number: 86,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561960,
//   },
//   rarity: "common",
// };
//
