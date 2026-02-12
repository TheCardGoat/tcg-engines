// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { challengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const jetsamUrsulasBaby: LorcanitoCharacterCard = {
//   Id: "tpe",
//   MissingTestCase: true,
//   Name: "Jetsam",
//   Title: 'Ursula\'s "Baby"',
//   Characteristics: ["dreamborn", "ally"],
//   Text: "**Challenger** +2 _(While challenging, this character gets +2 {S}.)_\n\n\n**OMINOUS PAIR** Your characters named Flotsam gain **Challenger** +2.",
//   Type: "character",
//   Abilities: [
//     ChallengerAbility(2),
//     {
//       Type: "static",
//       Ability: "gain-ability",
//       Name: "Ominous Pair",
//       Text: "Your characters named Flotsam gain **Challenger** +2.",
//       GainedAbility: challengerAbility(2),
//       Target: {
//         Type: "card",
//         Value: "all",
//         ExcludeSelf: true,
//         Filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           {
//             Filter: "attribute",
//             Value: "name",
//             Comparison: { operator: "eq", value: "Floatsam" },
//           },
//         ],
//       },
//     },
//   ],
//   Flavour: "He snatched the trident from the betrayed glimmer.",
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 3,
//   Strength: 2,
//   Willpower: 4,
//   Lore: 1,
//   Illustrator: "Brian Kesinger",
//   Number: 46,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 549468,
//   },
//   Rarity: "common",
// };
//
