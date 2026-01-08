import type { ActionCard } from "@tcg/lorcana-types";

export const strikeAGoodMatch: ActionCard = {
  id: "1ru",
  cardType: "action",
  name: "Strike a Good Match",
  inkType: ["emerald"],
  franchise: "Mulan",
  set: "003",
  text: "Draw 2 cards, then choose and discard a card.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 96,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e41d63dec20f63664cf1d0fa42b721e0f7d72447",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   discardACard,
//   drawXCards,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const strikeAGoodMatch: LorcanitoActionCard = {
//   id: "fd2",
//   name: "Strike a Good Match",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 2 or more can Exert.png to sing this song for free.)_\n\n\nDraw 2 cards, then choose and discard a card.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Strike a Good Match",
//       text: "Draw 2 cards, then choose and discard a card.",
//       resolveEffectsIndividually: true,
//       effects: [drawXCards(2), discardACard],
//     },
//   ],
//   flavour: "Please bring honor to us \nPlease bring honor to us all",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   illustrator: "Maxine Vee",
//   number: 96,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 538296,
//   },
//   rarity: "common",
// };
//
