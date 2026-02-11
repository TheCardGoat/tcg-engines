import type { ActionCard } from "@tcg/lorcana-types";

export const oneJumpAhead: ActionCard = {
  abilities: [
    {
      effect: {
        type: "put-into-inkwell",
        source: "top-of-deck",
        target: "CONTROLLER",
        exerted: true,
        facedown: true,
      },
      id: "gf6-1",
      text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\nPut the top card of your deck into your inkwell facedown and exerted.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 164,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  id: "gf6",
  inkType: ["sapphire"],
  inkable: true,
  name: "One Jump Ahead",
  set: "001",
  text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\nPut the top card of your deck into your inkwell facedown and exerted.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const oneJumpAhead: LorcanitoActionCard = {
//   Id: "gf6",
//   Reprints: ["uhq"],
//   Name: "One Jump Ahead",
//   Characteristics: ["action", "song"],
//   Text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\nPut the top card of your deck into your inkwell facedown and exerted.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "One Jump Ahead",
//       Text: "Put the top card of your deck into your inkwell facedown and exerted.",
//       Optional: false,
//       Effects: [
//         {
//           Type: "move",
//           To: "inkwell",
//           Exerted: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [{ filter: "top-deck", value: "self" }],
//           },
//         },
//       ],
//     },
//   ],
//   Flavour:
//     "Gotta eat to live, gotta steal to eat -\nTell you all about it when I got the time",
//   Colors: ["sapphire"],
//   Cost: 2,
//   Illustrator: "Bill Robinson",
//   Number: 164,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492726,
//   },
//   Rarity: "uncommon",
// };
//
