import type { ActionCard } from "@tcg/lorcana-types";

export const digALittleDeeper: ActionCard = {
  id: "win",
  cardType: "action",
  name: "Dig a Little Deeper",
  inkType: ["sapphire"],
  franchise: "Princess and the Frog",
  set: "009",
  text: "Sing Together 8 Look at the top 7 cards of your deck. Put 2 into your hand and the rest on the bottom of your deck in any order.",
  actionSubtype: "song",
  cost: 8,
  cardNumber: 166,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7532c69617d7ae6a280449248ba2db8345934f92",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { digALittleDeeper as ogDigALittleDeeper } from "@lorcanito/lorcana-engine/cards/004/actions/162-dig-a-little-deeper";
//
// export const digALittleDeeper: LorcanitoActionCard = {
//   ...ogDigALittleDeeper,
//   id: "pbu",
//   reprints: [ogDigALittleDeeper.id],
//   number: 166,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650100,
//   },
// };
//
