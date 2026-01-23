import type { ActionCard } from "@tcg/lorcana-types";

export const lostInTheWoods: ActionCard = {
  id: "6hj",
  cardType: "action",
  name: "Lost in the Woods",
  inkType: ["amber"],
  franchise: "Frozen",
  set: "009",
  text: "All opposing characters get -2 {S} until the start of your next turn.",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 28,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "17618cced0ecdbed9cd4811b627105e902448fa6",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { lostInTheWoods as ogLostInTheWoods } from "@lorcanito/lorcana-engine/cards/004/actions/029-lost-in-the-woods";
//
// export const lostInTheWoods: LorcanitoActionCard = {
//   ...ogLostInTheWoods,
//   id: "vre",
//   reprints: [ogLostInTheWoods.id],
//   number: 28,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649975,
//   },
// };
//
