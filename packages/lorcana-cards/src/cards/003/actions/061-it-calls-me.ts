import type { ActionCard } from "@tcg/lorcana-types";

export const itCallsMe: ActionCard = {
  id: "1sd",
  cardType: "action",
  name: "It Calls Me",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "003",
  text: "Draw a card. Then, choose up to 3 cards from chosen opponent's discard and shuffle them into their deck.",
  actionSubtype: "song",
  cost: 1,
  cardNumber: 61,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e78fcfdbd854c2d512d3769ebb8b9457a43ed90f",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const itCallsMe: LorcanitoActionCard = {
//   id: "jqp",
//   missingTestCase: true,
//   name: "It Calls Me",
//   characteristics: ["action", "song"],
//   text: "Draw a card. Shuffle up to 3 cards from your opponent's discard into your opponent's deck.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Draw a card. Shuffle up to 3 cards from your opponent's discard into your opponent's deck.",
//       resolveEffectsIndividually: true,
//       effects: [
//         drawACard,
//         {
//           type: "shuffle",
//           amount: 3,
//           target: {
//             type: "card",
//             value: 3,
//             upTo: true,
//             filters: [
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "I am everything I've learned and more",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 1,
//   illustrator: "Luis Huerta",
//   number: 61,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 539078,
//   },
//   rarity: "uncommon",
// };
//
