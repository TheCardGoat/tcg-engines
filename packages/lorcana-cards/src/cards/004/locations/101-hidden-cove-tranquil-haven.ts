// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// Import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const hiddenCoveTranquilHaven: LorcanitoLocationCard = {
//   Id: "s5s",
//   Reprints: ["sxr"],
//   Name: "Hidden Cove",
//   Title: "Tranquil Haven",
//   Characteristics: ["location"],
//   Text: "**REVITALIZING WATERS** Characters get +1 {S} and +1 {W} while here.",
//   Type: "location",
//   Abilities: [
//     GainAbilityWhileHere({
//       Name: "Revitalizing Waters",
//       Text: "Characters get +1 {S}",
//       Ability: {
//         Type: "static",
//         Ability: "effects",
//         Effects: [
//           {
//             Type: "attribute",
//             Attribute: "strength",
//             Amount: 1,
//             Modifier: "add",
//             Duration: "static",
//             Target: {
//               Type: "card",
//               Value: "all",
//               Filters: [{ filter: "source", value: "self" }],
//             },
//           },
//           {
//             Type: "attribute",
//             Attribute: "willpower",
//             Amount: 1,
//             Modifier: "add",
//             Duration: "static",
//             Target: {
//               Type: "card",
//               Value: "all",
//               Filters: [{ filter: "source", value: "self" }],
//             },
//           },
//         ],
//       },
//     }),
//   ],
//   Flavour: "Flounder, this is perfect! I can't wait to explore it. \n−Ariel",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 1,
//   MoveCost: 1,
//   Willpower: 6,
//   Illustrator: "Roberto Gatto",
//   Number: 101,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 550587,
//   },
//   Rarity: "common",
// };
//
