import type { ActionCard } from "@tcg/lorcana-types";

export const paintingTheRosesRed: ActionCard = {
  id: "2ft",
  cardType: "action",
  name: "Painting the Roses Red",
  inkType: ["amber"],
  franchise: "Alice in Wonderland",
  set: "002",
  text: "Up to 2 chosen characters get -1 {S} this turn. Draw a card.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 30,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "003e83f940426d943bddbae6a42d20fe26abf042",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// const self = {
//   type: "player" as const,
//   value: "self" as const,
// };
// const drawACard = {
//   type: "draw" as const,
//   amount: 1,
//   target: self,
// };
//
// export const paintingTheRosesRed: LorcanitoActionCard = {
//   id: "g0a",
//
//   name: "Painting the Roses Red",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\nUp to 2 chosen characters get -1 {S} this turn. Draw a card.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Painting the Roses Red",
//       text: "Up to 2 chosen characters get -1 {S} this turn. Draw a card.",
//       resolveEffectsIndividually: true,
//       effects: [
//         drawACard,
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "subtract",
//           target: {
//             type: "card",
//             value: 2,
//             upTo: true,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Matt Chapman",
//   number: 30,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527240,
//   },
//   rarity: "common",
// };
//
