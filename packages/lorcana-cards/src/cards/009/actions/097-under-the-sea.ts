import type { ActionCard } from "@tcg/lorcana-types";

export const underTheSea: ActionCard = {
  id: "1se",
  cardType: "action",
  name: "Under the Sea",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "009",
  text: "Sing Together 8 Put all opposing characters with 2 {S} or less on the bottom of their players’ decks in any order.",
  actionSubtype: "song",
  cost: 8,
  cardNumber: 97,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e81fec386fd1647801df51920cfaf2d60ad090b5",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { underTheSea as ogUnderTheSea } from "@lorcanito/lorcana-engine/cards/004/actions/095-under-the-sea";
//
// export const underTheSea: LorcanitoActionCard = {
//   ...ogUnderTheSea,
//   id: "wlg",
//   reprints: [ogUnderTheSea.id],
//   number: 97,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650035,
//   },
// };
//
