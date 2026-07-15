import type { ItemCard } from "@tcg/lorcana-types";

export const whiteRabbitundefined: ItemCard = {
  abilities: [],
  cardNumber: 68,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "White Rabbit - undefined",
  id: "u45",
  inkType: ["amethyst"],
  inkable: true,
  name: "White Rabbit",
  set: "001",
  text: "**I",
  version: "undefined",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Export const whiteRabbitPocketWatch: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "u45",
//   Reprints: ["u14"],
//
//   Name: "White Rabbit's Pocket Watch",
//   Text: "**I'm late!** {E}, 1 {I} - Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "I'm late!",
//       Text: "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
//       Costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//       Effects: [
//         {
//           Type: "ability",
//           Ability: "rush",
//           Modifier: "add",
//           Duration: "turn",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         } as AbilityEffect,
//       ],
//     } as ActivatedAbility,
//   ],
//   Flavour:
//     '"No wonder you\'re late. Why, this clock is exactly two days slow." −The Mad Hatter',
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 3,
//   Illustrator: "Kamil Murzyn",
//   Number: 68,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492712,
//   },
//   Rarity: "rare",
// };
//
