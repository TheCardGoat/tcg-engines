import type { ActionCard } from "@tcg/lorcana-types";

export const friendLikeMe: ActionCard = {
  id: "h7y",
  cardType: "action",
  name: "Friend Like Me",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "003",
  text: "Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.",
  actionSubtype: "song",
  cost: 5,
  cardNumber: 160,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3e110fc0d14a46a730ef6bd4e40926b1315281b7",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   topCardOfOpponentsDeck,
//   topCardOfYourDeck,
// } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const friendLikeMe: LorcanitoActionCard = {
//   id: "dje",
//   name: "Friend Like Me",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 5 or more can exert to sing this song for free.)_\n\n\nEach player puts the top 3 cards of their deck into their inkwell facedown and exerted.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Friend Like Me",
//       text: "Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.",
//       effects: [
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: topCardOfYourDeck,
//         },
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: topCardOfYourDeck,
//         },
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: topCardOfYourDeck,
//         },
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: topCardOfOpponentsDeck,
//         },
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: topCardOfOpponentsDeck,
//         },
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: topCardOfOpponentsDeck,
//         },
//       ],
//     },
//   ],
//   flavour: "You got some power in your corner now",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 5,
//   illustrator: "Emily Abeydeera",
//   number: 160,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 536285,
//   },
//   rarity: "rare",
// };
//
