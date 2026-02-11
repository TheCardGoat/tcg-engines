// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   CardEffectTarget,
//   LorcanitoActionCard,
// } from "@lorcanito/lorcana-engine";
// Import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// Const characterOfYoursWithACardUnderThem: CardEffectTarget = {
//   Type: "card",
//   Value: 1,
//   Filters: [
//     { filter: "has_card_under_them" },
//     { filter: "owner", value: "self" },
//     { filter: "type", value: "character" },
//   ],
// };
//
// Export const timeToGo: LorcanitoActionCard = {
//   Id: "or3",
//   Name: "Time to Go!",
//   Characteristics: ["action"],
//   Text: "Banish chosen character of yours to draw 2 cards. If that character had a card under them, draw 3 cards instead.",
//   Type: "action",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 3,
//   Illustrator: "Matthew Robert Davies",
//   Number: 131,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 660003,
//   },
//   Rarity: "uncommon",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "target-conditional",
//           Target: chosenCharacterOfYours,
//           Effects: [
//             {
//               Type: "banish",
//               Target: characterOfYoursWithACardUnderThem,
//             },
//             DrawXCards(3),
//           ],
//           Fallback: [
//             {
//               Type: "banish",
//               Target: chosenCharacterOfYours,
//             },
//             DrawXCards(2),
//           ],
//         },
//       ],
//     },
//   ],
// };
//
