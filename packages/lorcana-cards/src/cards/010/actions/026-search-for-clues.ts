import type { ActionCard } from "@tcg/lorcana-types";

export const searchForClues: ActionCard = {
  id: "167",
  cardType: "action",
  name: "Search for Clues",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "010",
  text: "The player or players with the most cards in their hands choose and discard 2 cards. If you have a Detective character in play, gain 1 lore.",
  cost: 4,
  cardNumber: 26,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9a4aae2e38a1d62d48a0e1a6e6e406b746b71b95",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { discardTwoCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const searchForClues: LorcanitoActionCard = {
//   id: "uip",
//   name: "Search For Clues",
//   characteristics: ["action"],
//   text: "The player or players with the most cards in their hands choose and discard 2 cards. If you have a Detective character in play, gain 1 lore.",
//   type: "action",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   illustrator: "Rubin Chung",
//   number: 26,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658337,
//   },
//   rarity: "uncommon",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Search For Clues",
//       text: "The player or players with the most cards in their hands choose and discard 2 cards.",
//       resolutionConditions: [
//         {
//           type: "hand",
//           amount: "gte",
//           player: "self",
//         },
//       ],
//       effects: [discardTwoCards],
//     },
//     {
//       type: "resolution",
//       name: "Search For Clues",
//       text: "The player or players with the most cards in their hands choose and discard 2 cards.",
//       resolutionConditions: [
//         {
//           type: "hand",
//           amount: "gte",
//           player: "opponent",
//         },
//       ],
//       responder: "opponent",
//       effects: [discardTwoCards],
//     },
//     {
//       type: "resolution",
//       name: "Search For Clues",
//       text: "If you have a Detective character in play, gain 1 lore.",
//       resolutionConditions: [
//         {
//           type: "filter",
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "characteristics", value: ["detective"] },
//             { filter: "owner", value: "self" },
//           ],
//           comparison: { operator: "gte", value: 1 },
//         },
//       ],
//       effects: [
//         {
//           type: "lore",
//           modifier: "add",
//           amount: 1,
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//     },
//   ],
// };
//
