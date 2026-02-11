// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// Import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const badanonVillainSupportCenter: LorcanitoLocationCard = {
//   Id: "lvt",
//   MissingTestCase: true,
//   Name: "Bad-Anon",
//   Title: "Villain Support Center",
//   Characteristics: ["location"],
//   Text: "**THERE'S NO ONE I'D RATHER BE THAN ME** Villain characters gain {E}, 3 {I} - Play a character with the same name as this character for free\" while here.",
//   Type: "location",
//   Abilities: [
//     GainAbilityWhileHere({
//       Name: "THERE'S NO ONE I'D RATHER BE THAN ME",
//       Text: 'Villain characters gain "{E}, 3 {I} - Play a character with the same name as this character for free" while here.',
//       Ability: {
//         Type: "activated",
//         Name: "THERE'S NO ONE I'D RATHER BE THAN ME",
//         Text: "{E}, 3 {I} - Play a character with the same name as this character for free",
//         Costs: [{ type: "exert" }, { type: "ink", amount: 3 }],
//         Effects: [
//           {
//             Type: "play",
//             ForFree: true,
//             Target: {
//               Type: "card",
//               Value: 1,
//               Filters: [
//                 { filter: "owner", value: "self" },
//                 { filter: "zone", value: "hand" },
//                 { filter: "type", value: "character" },
//                 { filter: "characteristics", value: ["villain"] },
//                 // TODO: Check if the name is the same
//               ],
//             },
//           },
//         ],
//       },
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 2,
//   Willpower: 7,
//   Lore: 1,
//   Illustrator: "Saulo Nate",
//   Number: 203,
//   Set: "SSK",
//   ExternalIds: {
//     TcgPlayer: 555276,
//   },
//   Rarity: "rare",
//   MoveCost: 1,
// };
//
