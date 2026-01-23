import type { ActionCard } from "@tcg/lorcana-types";

export const lookAtThisFamily: ActionCard = {
  id: "lj6",
  cardType: "action",
  name: "Look at This Family",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "009",
  text: "Sing Together 7 Look at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
  actionSubtype: "song",
  cost: 7,
  cardNumber: 25,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4d9b353aa7f368d78fa825e4fdce71da6b544363",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { lookAtThisFamily as ogLookAtThisFamily } from "@lorcanito/lorcana-engine/cards/004/actions/028-look-at-this-family";
//
// export const lookAtThisFamily: LorcanitoActionCard = {
//   ...ogLookAtThisFamily,
//   id: "h6u",
//   reprints: [ogLookAtThisFamily.id],
//   number: 25,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649973,
//   },
// };
//
