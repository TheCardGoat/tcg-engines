// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// Import { allOpposingCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whileYouHaveCharactersHere } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// Export const galacticCouncilChamber: LorcanitoLocationCard = {
//   Id: "yrd",
//   Name: "Galactic Council Chamber",
//   Title: "Courtroom",
//   Characteristics: ["location"],
//   Text: "**FEDERATION DECREE** While you have an Alien or Robot character here, this location can’t be challenged.",
//   Type: "location",
//   Abilities: [
//     WhileYouHaveCharactersHere({
//       Name: "Federation Decree",
//       Text: "While you have an Alien or Robot character here, this location can’t be challenged.",
//       Conditions: [
//         {
//           Type: "chars-at-location",
//           Comparison: { operator: "gte", value: 1 },
//           Filters: [
//             {
//               Filter: "characteristics",
//               Value: ["alien", "robot"],
//               Conjunction: "or",
//             },
//           ],
//         },
//       ],
//       Ability: {
//         Type: "static",
//         Ability: "effects",
//         Effects: [
//           {
//             Type: "protection",
//             From: "challenge",
//             Target: allOpposingCharacters,
//           },
//         ],
//       },
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 3,
//   Willpower: 7,
//   Lore: 1,
//   Illustrator: "Kaitlin Cuthbertson",
//   Number: 204,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 578235,
//   },
//   Rarity: "common",
//   MoveCost: 1,
// };
//
