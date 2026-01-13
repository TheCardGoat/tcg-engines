import type { ActionCard } from "@tcg/lorcana-types";

export const aVeryMerryUnbirthday: ActionCard = {
  id: "1gn",
  cardType: "action",
  name: "A Very Merry Unbirthday",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  text: "Each opponent puts the top 2 cards of their deck into their discard.",
  actionSubtype: "song",
  cost: 1,
  cardNumber: 60,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bec1b79d300150cdb92902404916f10483de4dbd",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { millOpponentXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const aVeryMerryUnbirthday: LorcanitoActionCard = {
//   id: "pfv",
//   missingTestCase: true,
//   name: "A Very Merry Unbirthday",
//   characteristics: ["action", "song"],
//   text: "(A character with cost 1 or more can {E} to sing this song for free.)\nEach opponent puts the top 2 cards of their deck into their discard.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "A Very Merry Unbirthday",
//       text: "Each opponent puts the top 2 cards of their deck into their discard.",
//       effects: millOpponentXCards(2),
//     },
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 1,
//   illustrator: "Geoffrey Bodeau",
//   number: 60,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591114,
//   },
//   rarity: "common",
// };
//
