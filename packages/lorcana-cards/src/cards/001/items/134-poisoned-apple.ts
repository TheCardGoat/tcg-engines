import type { ItemCard } from "@tcg/lorcana-types";

export const poisonedApple: ItemCard = {
  abilities: [],
  cardNumber: 134,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Poisoned Apple - undefined",
  id: "g0y",
  inkType: ["ruby"],
  inkable: true,
  name: "Poisoned Apple",
  set: "001",
  text: "**TAKE A BITE . . . ** 1 {I}, Banish this item − Exert chosen character. If a Princess character is chosen, banish her instead.",
  version: "undefined",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
// Import type {
//   ExertEffect,
//   TargetConditionalEffect,
// } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Const chosenCharacter: CardEffectTarget = {
//   Type: "card",
//   Value: 1,
//   Filters: [
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//   ],
// };
//
// Export const poisonedApple: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "g0y",
//
//   Name: "Poisoned Apple",
//   Text: "**TAKE A BITE . . . ** 1 {I}, Banish this item − Exert chosen character. If a Princess character is chosen, banish her instead.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "Poisoned Apple",
//       Text: "Banish this item − Exert chosen character. If a Princess character is chosen, banish her instead.",
//       Costs: [{ type: "banish" }, { type: "ink", amount: 1 }],
//       Effects: [
//         {
//           Type: "target-conditional",
//           AutoResolve: false,
//           // TODO: RE implement conditional target, this is not correct
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "characteristics", value: ["princess"] },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//           Effects: [
//             {
//               Type: "banish",
//               Target: {
//                 Type: "card",
//                 Value: 1,
//                 Filters: [
//                   { filter: "characteristics", value: ["princess"] },
//                   { filter: "type", value: "character" },
//                   { filter: "zone", value: "play" },
//                 ],
//               },
//             },
//           ],
//           Fallback: [
//             {
//               Type: "exert",
//               Exert: true,
//               Target: chosenCharacter,
//             } as ExertEffect,
//           ],
//         } as TargetConditionalEffect,
//       ],
//     } as ActivatedAbility,
//   ],
//   Flavour:
//     "One taste of the poisoned apple, and the victim's eyes will close forever. . . . \n−The Queen",
//   Colors: ["ruby"],
//   Cost: 3,
//   Illustrator: "Andrew Trabbold",
//   Number: 134,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 507862,
//   },
//   Rarity: "rare",
// };
//
