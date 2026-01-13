import type { ActionCard } from "@tcg/lorcana-types";

export const iFindEmIFlattenEm: ActionCard = {
  id: "1xm",
  cardType: "action",
  name: "I Find ’Em, I Flatten ’Em",
  inkType: ["steel"],
  franchise: "Encanto",
  set: "009",
  text: "Banish all items.",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 199,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fb56f29241ca17496d5e5417bca9cff146007bf3",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { iFindEmIFlattenEm as ogIFindEmIFlattenEm } from "@lorcanito/lorcana-engine/cards/004/actions/196-i-find-em-i-flatten-em";
//
// export const iFindEmIFlattenEm: LorcanitoActionCard = {
//   ...ogIFindEmIFlattenEm,
//   id: "eok",
//   reprints: [ogIFindEmIFlattenEm.id],
//   number: 199,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650132,
//   },
// };
//
