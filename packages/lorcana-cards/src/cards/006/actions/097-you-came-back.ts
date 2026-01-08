import type { ActionCard } from "@tcg/lorcana-types";

export const youCameBack: ActionCard = {
  id: "1dw",
  cardType: "action",
  name: "You Came Back",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "Ready chosen character.",
  cost: 3,
  cardNumber: 97,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b2698b79ffc3b73ed2fbd0eb78ade15a624dace1",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { readyChosenCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const youCameBack: LorcanitoActionCard = {
//   id: "bl8",
//   name: "You Came Back",
//   characteristics: ["action"],
//   text: "Ready chosen character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [readyChosenCharacter],
//     },
//   ],
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 3,
//   illustrator: "Michaela Martin",
//   number: 97,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591997,
//   },
//   rarity: "rare",
// };
//
