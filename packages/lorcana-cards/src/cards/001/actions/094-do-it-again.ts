import type { ActionCard } from "@tcg/lorcana-types";

export const doItAgain: ActionCard = {
  abilities: [
    {
      effect: {
        type: "return-from-discard",
        cardType: "action",
        target: "CONTROLLER",
      },
      id: "8s5-1",
      text: "Return an action card from your discard to your hand.",
      type: "action",
    },
  ],
  cardNumber: 94,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "1fa692d71466897743f12f7dbceee65c69c5d6a5",
  },
  franchise: "Cinderella",
  id: "8s5",
  inkType: ["emerald"],
  inkable: false,
  name: "Do It Again!",
  set: "001",
  text: "Return an action card from your discard to your hand.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const doItAgain: LorcanitoActionCard = {
//   Id: "yld",
//   Name: "Do It Again!",
//   Characteristics: ["action"],
//   Text: "Return an action card from your discard to your hand.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Do It Again!",
//       Text: "Return an action card from your discard to your hand.",
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: ["action"] },
//               { filter: "zone", value: "discard" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Flavour:
//     ". . . Then scrub the terrace, sweep the halls and the stairs, clean the chimneys. And of course there's the mending, and the sewing, and the laundry . . . −Lady Tremaine",
//   Colors: ["emerald"],
//   Cost: 3,
//   Illustrator: "Ellie Horie",
//   Number: 94,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 506830,
//   },
//   Rarity: "rare",
// };
//
