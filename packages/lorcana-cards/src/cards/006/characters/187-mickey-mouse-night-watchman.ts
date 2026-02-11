// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const mickeyMouseNightWatchman: LorcanitoCharacterCard = {
//   Id: "tup",
//   MissingTestCase: true,
//   Name: "Mickey Mouse",
//   Title: "Night Watch",
//   Characteristics: ["storyborn", "hero"],
//   Text: "SUPPORT Your Pluto characters get Resist +1. (Damage dealt to them is reduced by 1.)",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Ability: "gain-ability",
//       Name: "Support",
//       Text: "Your Pluto characters get Resist +1. (Damage dealt to them is reduced by 1.)",
//       GainedAbility: resistAbility(1),
//       Target: {
//         Type: "card",
//         Value: "all",
//         Filters: [
//           {
//             Filter: "attribute",
//             Value: "name",
//             Comparison: { operator: "eq", value: "pluto" },
//           },
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           { filter: "owner", value: "self" },
//         ],
//       },
//     },
//   ],
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 3,
//   Strength: 2,
//   Willpower: 3,
//   Lore: 2,
//   Illustrator: "Hedvig Heggman-Sund",
//   Number: 187,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 591144,
//   },
//   Rarity: "uncommon",
// };
//
