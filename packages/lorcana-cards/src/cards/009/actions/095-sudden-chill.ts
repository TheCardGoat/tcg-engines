import type { ActionCard } from "@tcg/lorcana-types";

export const suddenChill: ActionCard = {
  id: "1ck",
  cardType: "action",
  name: "Sudden Chill",
  inkType: ["emerald"],
  franchise: "101 Dalmatians",
  set: "009",
  text: "Each opponent chooses and discards a card.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 95,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "af0402088e469d5b1093c6206c115b0e96e599c3",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { suddenChill as suddenChillAsOrig } from "@lorcanito/lorcana-engine/cards/001/songs/098-sudden-chill";
//
// export const suddenChill: LorcanitoActionCard = {
//   ...suddenChillAsOrig,
//   id: "f3l",
//   reprints: [suddenChillAsOrig.id],
//   number: 95,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650033,
//   },
// };
//
