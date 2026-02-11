import type { ActionCard } from "@tcg/lorcana-types";

export const partOfYourWorld: ActionCard = {
  abilities: [
    {
      effect: {
        type: "return-from-discard",
        cardType: "character",
        target: "CONTROLLER",
      },
      id: "fn0-1",
      text: "Return a character card from your discard to your hand.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 30,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "385d2d6b1f6d4093408da9cd744c87865c9a538b",
  },
  franchise: "Little Mermaid",
  id: "fn0",
  inkType: ["amber"],
  inkable: false,
  name: "Part of Your World",
  set: "001",
  text: "Return a character card from your discard to your hand.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const partOfYourWorld: LorcanitoActionCard = {
//   Id: "ztz",
//   Name: "Part of Your World",
//   Characteristics: ["action", "song"],
//   Text: "_(A character with cost 3 or more can {E} to sing this song\rfor free.)_\n Return a character card from your discard to your hand.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Part of Your World",
//       Text: "Return a character card from your discard to your hand.",
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "discard" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Flavour: "What would I give\nIf I could live out of these waters?",
//   Colors: ["amber"],
//   Cost: 3,
//   Illustrator: "Samanta Erdini",
//   Number: 30,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 493481,
//   },
//   Rarity: "rare",
// };
//
