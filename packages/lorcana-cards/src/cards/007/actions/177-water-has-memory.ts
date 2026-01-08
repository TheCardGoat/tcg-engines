import type { ActionCard } from "@tcg/lorcana-types";

export const waterHasMemory: ActionCard = {
  id: "q8v",
  cardType: "action",
  name: "Water Has Memory",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "007",
  text: "Look at the top 4 cards of chosen player's deck. Put one on the top of their deck and the rest on the bottom of their deck in any order.",
  cost: 1,
  cardNumber: 177,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5e97cf7b8358a2a7fa4446b2bfdf89d0986ab9fe",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { waterHasMemoryAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const waterHasMemory: LorcanitoActionCard = {
//   id: "boh",
//   name: "Water Has Memory",
//   characteristics: ["action"],
//   type: "action",
//   inkwell: false,
//   colors: ["sapphire"],
//   cost: 1,
//   illustrator: "Samoldstorre",
//   number: 177,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618722,
//   },
//   rarity: "common",
//   text: "Look at the top 4 cards of chosen player's deck. Put one on the top of their deck and the rest on the bottom of their deck in any order.",
//   abilities: [waterHasMemoryAbility],
// };
//
