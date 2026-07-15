import type { ItemCard } from "@tcg/lorcana-types";

export const dinglehopper: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: "CHOSEN_CHARACTER",
        type: "remove-damage",
        upTo: true,
      },
      id: "7r6-1",
      name: "STRAIGHTEN HAIR",
      text: "STRAIGHTEN HAIR {E} — Remove up to 1 damage from chosen character.",
      type: "activated",
    },
  ],
  cardNumber: 32,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "00c6be6408d3d9e54f25ef26b390b9087bf722cb",
  },
  franchise: "Little Mermaid",
  id: "7r6",
  inkType: ["amber"],
  inkable: true,
  name: "Dinglehopper",
  set: "001",
  text: "STRAIGHTEN HAIR {E} — Remove up to 1 damage from chosen character.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const dingleHopper: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "qef",
//   Name: "Dinglehopper",
//   Text: "**STRAIGHTEN HAIR** {E} - Remove up to 1 damage from chosen character.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "Straighten Hair",
//       Text: "{E} - Remove up to 1 damage from chosen character.",
//       Optional: false,
//       Costs: [{ type: "exert" }],
//       Effects: [
//         {
//           Type: "heal",
//           Amount: 1,
//           UpTo: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   Flavour: "Enjoy the finest of human hairstyles.",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 1,
//   Illustrator: "Eri Welli",
//   Number: 32,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492733,
//   },
//   Rarity: "common",
// };
//
