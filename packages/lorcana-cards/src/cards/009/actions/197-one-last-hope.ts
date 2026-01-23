import type { ActionCard } from "@tcg/lorcana-types";

export const oneLastHope: ActionCard = {
  id: "13s",
  cardType: "action",
  name: "One Last Hope",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "009",
  text: "Chosen character gains Resist +2 until the start of your next turn. If a Hero character is chosen, they can also challenge ready characters this turn. (Damage dealt to them is reduced by 2.)",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 197,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8f6416c63cac0fad17fdf749cf9ede58f5fd446b",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { oneLastHope as ogOneLastHope } from "@lorcanito/lorcana-engine/cards/004/actions/197-one-last-hope";
//
// export const oneLastHope: LorcanitoActionCard = {
//   ...ogOneLastHope,
//   id: "i3n",
//   reprints: [ogOneLastHope.id],
//   number: 197,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650130,
//   },
// };
//
