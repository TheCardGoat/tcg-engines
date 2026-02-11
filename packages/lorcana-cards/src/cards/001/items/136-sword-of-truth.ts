import type { ItemCard } from "@tcg/lorcana-types";

export const swordOfTruth: ItemCard = {
  abilities: [],
  cardNumber: 136,
  cardType: "item",
  cost: 4,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Sword of Truth - undefined",
  id: "jpg",
  inkType: ["ruby"],
  inkable: true,
  name: "Sword of Truth",
  set: "001",
  text: "**FINAL ENCHANTMENT** Banish this item − Banish chosen Villain character.",
  version: "undefined",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const swordOfTruth: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "jpg",
//
//   Name: "Sword of Truth",
//   Text: "**FINAL ENCHANTMENT** Banish this item − Banish chosen Villain character.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "Final Enchantment",
//       Text: "Banish this item − Banish chosen Villain character.",
//       Costs: [{ type: "banish" }],
//       Effects: [
//         {
//           Type: "banish",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "characteristics", value: ["villain"] },
//             ],
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   Flavour: "Almost as powerful as True Love's Kiss.",
//   Colors: ["ruby"],
//   Cost: 4,
//   Illustrator: "Andrew Trabbold",
//   Number: 136,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508793,
//   },
//   Rarity: "rare",
// };
//
