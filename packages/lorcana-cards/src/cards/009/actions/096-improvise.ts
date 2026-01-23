import type { ActionCard } from "@tcg/lorcana-types";

export const improvise: ActionCard = {
  id: "gai",
  cardType: "action",
  name: "Improvise",
  inkType: ["emerald"],
  franchise: "Mulan",
  set: "009",
  text: "Chosen character gets +1 {S} this turn. Draw a card.",
  cost: 1,
  cardNumber: 96,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3ab79a09520ac3d506965f3d02a348a861f725c5",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { improvise as ogImprovise } from "@lorcanito/lorcana-engine/cards/002/actions/099-improvise";
//
// export const improvise: LorcanitoActionCard = {
//   ...ogImprovise,
//   id: "tdy",
//   reprints: [ogImprovise.id],
//   number: 96,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650034,
//   },
// };
//
