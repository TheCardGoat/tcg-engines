import type { ActionCard } from "@tcg/lorcana-types";

export const beOurGuest: ActionCard = {
  id: "25a",
  cardType: "action",
  name: "Be Our Guest",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 25,
  inkable: true,
  externalIds: {
    ravensburger: "25a", // Placeholder
  },
  abilities: [
    {
      id: "25a-1",
      text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      type: "action",
      effect: {
        type: "look-at-cards",
        amount: 4,
        from: "top-of-deck",
        target: "CONTROLLER",
        then: {
          action: "put-in-hand",
          filter: { type: "card-type", cardType: "character" },
        },
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// export const beOurGuest: LorcanitoActionCard = {
//   id: "m6n",
//   reprints: ["cwb"],
//   name: "Be Our Guest",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 2 or more can {E} to sing this\rsong for free.)_\nLook at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Be Our Guest",
//       text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
//       optional: false,
//       effects: [
//         {
//           type: "scry",
//           amount: 4,
//           mode: "bottom",
//           shouldRevealTutored: true,
//           limits: {
//             bottom: 4,
//             inkwell: 0,
//             top: 0,
//             hand: 1,
//           },
//           tutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "deck" },
//           ],
//         } as ScryEffect,
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "R. La Barbera / L. Giammichele",
//   number: 25,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 494110,
//   },
//   rarity: "uncommon",
// };

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { ScryEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const beOurGuest: LorcanitoActionCard = {
//   id: "m6n",
//   reprints: ["cwb"],
//   name: "Be Our Guest",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 2 or more can {E} to sing this\rsong for free.)_\nLook at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Be Our Guest",
//       text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
//       optional: false,
//       effects: [
//         {
//           type: "scry",
//           amount: 4,
//           mode: "bottom",
//           shouldRevealTutored: true,
//           limits: {
//             bottom: 4,
//             inkwell: 0,
//             top: 0,
//             hand: 1,
//           },
//           tutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "deck" },
//           ],
//         } as ScryEffect,
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "R. La Barbera / L. Giammichele",
//   number: 25,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 494110,
//   },
//   rarity: "uncommon",
// };
//
