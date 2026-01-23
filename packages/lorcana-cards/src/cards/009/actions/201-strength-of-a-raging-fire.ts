import type { ActionCard } from "@tcg/lorcana-types";

export const strengthOfARagingFire: ActionCard = {
  id: "xzc",
  cardType: "action",
  name: "Strength of a Raging Fire",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "009",
  text: "Deal damage to chosen character equal to the number of characters you have in play.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 201,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7a794400c5430b77a9bd93dc9c73e7ae38d73f5e",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { strengthOfARagingFire as ogStrengthOfARagingFire } from "@lorcanito/lorcana-engine/cards/002/actions/201-strength-of-a-raging-fire";
//
// export const strengthOfARagingFire: LorcanitoActionCard = {
//   ...ogStrengthOfARagingFire,
//   id: "fua",
//   reprints: [ogStrengthOfARagingFire.id],
//   number: 201,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 647674,
//   },
// };
//
