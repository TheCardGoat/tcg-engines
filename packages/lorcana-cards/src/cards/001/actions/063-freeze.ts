import type { ActionCard } from "@tcg/lorcana-types";

export const freeze: ActionCard = {
  abilities: [
    {
      effect: {
        type: "exert",
        target: "CHOSEN_OPPOSING_CHARACTER",
      },
      id: "1cq-1",
      text: "Exert chosen opposing character.",
      type: "action",
    },
  ],
  cardNumber: 63,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "adcdee7c29e76d6c7249456e6ff99ae44efe9e6e",
  },
  franchise: "Frozen",
  id: "1cq",
  inkType: ["amethyst"],
  inkable: false,
  name: "Freeze",
  set: "001",
  text: "Exert chosen opposing character.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const freeze: LorcanitoActionCard = {
//   Id: "e7s",
//   Name: "Freeze",
//   Characteristics: ["action"],
//   Text: "Exert chosen opposing character.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Freeze",
//       Text: "Exert chosen opposing character.",
//       Effects: [
//         {
//           Type: "exert",
//           Exert: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Flavour: "It's time for you to chill.",
//   Colors: ["amethyst"],
//   Cost: 2,
//   Illustrator: "Cristian Romero",
//   Number: 63,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508733,
//   },
//   Rarity: "common",
// };
//
