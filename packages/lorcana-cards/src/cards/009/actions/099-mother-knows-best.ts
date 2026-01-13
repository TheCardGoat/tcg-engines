import type { ActionCard } from "@tcg/lorcana-types";

export const motherKnowsBest: ActionCard = {
  id: "17a",
  cardType: "action",
  name: "Mother Knows Best",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "009",
  text: "Return chosen character to their player's hand.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 99,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9b13536dce3331ad25596984ff3b7f2f4a66b1f4",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { motherKnowsBest as motherKnowsBestAsOrig } from "@lorcanito/lorcana-engine/cards/001/songs/095-mother-knows-best";
//
// export const motherKnowsBest: LorcanitoActionCard = {
//   ...motherKnowsBestAsOrig,
//   id: "px0",
//   reprints: [motherKnowsBestAsOrig.id],
//   number: 99,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650037,
//   },
// };
//
