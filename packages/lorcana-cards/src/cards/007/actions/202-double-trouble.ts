import type { ActionCard } from "@tcg/lorcana-types";

export const doubleTrouble: ActionCard = {
  id: "h98",
  cardType: "action",
  name: "Double Trouble",
  inkType: ["steel"],
  franchise: "Sleeping Beauty",
  set: "007",
  text: "Deal 1 damage each to up to 2 chosen characters.",
  cost: 2,
  cardNumber: 202,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3e31b41e5c09e6378ea85d26576fd33b5e524c80",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { doubleTroubleAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const doubleTrouble: LorcanitoActionCard = {
//   id: "kxb",
//   name: "Double Trouble",
//   characteristics: ["action"],
//   text: "Deal 1 damage to up to 2 chosen characters.",
//   type: "action",
//   abilities: [doubleTroubleAbility],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   illustrator: "Natalie Dombois",
//   number: 202,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619524,
//   },
//   rarity: "uncommon",
// };
//
