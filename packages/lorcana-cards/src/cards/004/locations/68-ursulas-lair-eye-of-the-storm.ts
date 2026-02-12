// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// Import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { returnThisCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const ursulasLairEyeOfTheStorm: LorcanitoLocationCard = {
//   Id: "tj7",
//   MissingTestCase: true,
//   Name: "Ursula's Lair",
//   Title: "Eye of the Storm",
//   Characteristics: ["location"],
//   Text: "**SLIPPERY HALLS** Whenever a characters is banished in a challenge while here, you may return them to your hand. \n\n\n**SEAT OF POWER** Characters named Ursula get +1 {L} while here.",
//   Type: "location",
//   Abilities: [
//     GainAbilityWhileHere({
//       Name: "Seat of Power",
//       Text: "Characters named Ursula get +1 {L} while here.",
//       Ability: {
//         Type: "static",
//         Ability: "effects",
//         Effects: [
//           {
//             Type: "attribute",
//             Attribute: "lore",
//             Amount: 1,
//             Modifier: "add",
//             Duration: "static",
//             Target: {
//               Type: "card",
//               Value: "all",
//               Filters: [
//                 { filter: "source", value: "self" },
//                 {
//                   Filter: "attribute",
//                   Value: "name",
//                   Comparison: { operator: "eq", value: "ursula" },
//                 },
//               ],
//             },
//           },
//         ],
//       },
//     }),
//     GainAbilityWhileHere({
//       Name: "Slippery Halls",
//       Text: "Whenever a characters is banished in a challenge while here, you may return them to your hand.",
//       Ability: whenThisCharacterBanishedInAChallenge({
//         Name: "Slippery Halls",
//         Text: "Whenever a characters is banished in a challenge while here, you may return them to your hand.",
//         Optional: true,
//         Effects: [returnThisCardToHand],
//       }),
//     }),
//   ],
//   Colors: ["amethyst"],
//   Cost: 3,
//   MoveCost: 2,
//   Willpower: 6,
//   Lore: 1,
//   Illustrator: "Eri Welli / Sam Burley",
//   Number: 68,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 547784,
//   },
//   Rarity: "rare",
// };
//
