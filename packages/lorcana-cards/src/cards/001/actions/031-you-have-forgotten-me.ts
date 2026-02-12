import type { ActionCard } from "@tcg/lorcana-types";

export const youHaveForgottenMe: ActionCard = {
  abilities: [
    {
      effect: {
        type: "discard",
        amount: 2,
        target: "EACH_OPPONENT",
        chosen: true,
      },
      id: "1cn-1",
      text: "Each opponent chooses and discards 2 cards.",
      type: "action",
    },
  ],
  cardNumber: 31,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "af649d5bbf464478b0095af6a2bebd4bf32e467d",
  },
  franchise: "Lion King",
  id: "1cn",
  inkType: ["amber"],
  inkable: true,
  name: "You Have Forgotten Me",
  set: "001",
  text: "Each opponent chooses and discards 2 cards.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { DiscardEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Export const youHaveForgottenMe: LorcanitoActionCard = {
//   Id: "z53",
//   Name: "You Have Forgotten Me",
//   Characteristics: ["action"],
//   Text: "Each opponent chooses and discards 2 cards.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "You Have Forgotten Me",
//       Text: "Each opponent chooses and discards two cards.",
//       Optional: false,
//       Responder: "opponent",
//       Effects: [
//         {
//           Type: "discard",
//           Amount: 2,
//           Target: {
//             Type: "card",
//             Value: 2,
//             Filters: [
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         } as DiscardEffect,
//       ],
//     },
//   ],
//   Flavour: "You are more than what you have become. \n−Mufasa",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 4,
//   Illustrator: "Alice Pisoni",
//   Number: 31,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508716,
//   },
//   Rarity: "uncommon",
// };
//
