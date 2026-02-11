import type { ActionCard } from "@tcg/lorcana-types";

export const hesGotASword: ActionCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      id: "1hz-1",
      text: "Chosen character gets +2 {S} this turn.",
      type: "static",
    },
  ],
  cardNumber: 132,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "c286fc16a13143ed3d347c25f5f85877a90a8bd5",
  },
  franchise: "Aladdin",
  id: "1hz",
  inkType: ["ruby"],
  inkable: true,
  name: "He's Got a Sword!",
  set: "001",
  text: "Chosen character gets +2 {S} this turn.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const hesGotASword: LorcanitoActionCard = {
//   Id: "wmw",
//   Name: "He's Got a Sword!",
//   Characteristics: ["action"],
//   Text: "Chosen character gets +2 {S} this turn.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Amount: 2,
//           Modifier: "add",
//           Duration: "turn",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Flavour: "We've all got swords! \n−Razoul",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 1,
//   Illustrator: "Koni",
//   Number: 132,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508782,
//   },
//   Rarity: "common",
// };
//
