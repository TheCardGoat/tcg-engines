// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import {
//   DrawXCards,
//   MayBanish,
// } from "@lorcanito/lorcana-engine/effects/effects";
// Import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// Const chosenCharacterOfYours: CardEffectTarget = {
//   Type: "card",
//   Value: 1,
//   Filters: [
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//     { filter: "owner", value: "self" },
//   ],
// };
//
// Export const dinnerBell: LorcanitoItemCard = {
//   Id: "s78",
//   Reprints: ["box"],
//
//   Name: "Dinner Bell",
//   Characteristics: ["item"],
//   Text: "**YOU KNOW WHAT HAPPENS** {E}, 2 {I} − Draw cards equal to the damage on chosen character of yours, then banish them.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "You Know What Happens",
//       Text: "{E}, 2 {I} − Draw cards equal to the damage on chosen character of yours, then banish them.",
//       Costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
//       Effects: [
//         {
//           Type: "create-layer-based-on-target",
//           Target: chosenCharacterOfYours,
//           ResolveAmountBeforeCreatingLayer: true,
//           Effects: [
//             DrawXCards({
//               Dynamic: true,
//               Target: { attribute: "damage" },
//             }),
//           ],
//         },
//         MayBanish(chosenCharacterOfYours),
//       ],
//     },
//   ],
//
//   Flavour: "The delicate sound of impending doom.",
//   Colors: ["ruby"],
//   Cost: 4,
//   Illustrator: "Peter Brockhammer",
//   Number: 134,
//   Set: "ROF",
//   ExternalIds: {
//     TcgPlayer: 516420,
//   },
//   Rarity: "rare",
// };
//
