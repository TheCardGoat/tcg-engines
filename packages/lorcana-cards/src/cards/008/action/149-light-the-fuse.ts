// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   LorcanitoActionCard,
//   ResolutionAbility,
// } from "@lorcanito/lorcana-engine";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Const lightTheFuseAbility: ResolutionAbility = {
//   Type: "resolution",
//   Effects: [
//     {
//       Type: "damage",
//       Amount: {
//         Dynamic: true,
//         Filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           { filter: "owner", value: "self" },
//           {
//             Filter: "status",
//             Value: "exerted",
//           },
//         ],
//       },
//       Target: chosenCharacter,
//     },
//   ],
// };
//
// Export const lightTheFuse: LorcanitoActionCard = {
//   Id: "cep",
//   Name: "Light The Fuse",
//   Characteristics: ["action"],
//   Text: "Deal 1 damage to chosen character for each exerted character you have in play.",
//   Type: "action",
//   Inkwell: false,
//   Colors: ["ruby", "steel"],
//   Cost: 1,
//   Illustrator: "Kenneth Anderson",
//   Number: 149,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631449,
//   },
//   Rarity: "uncommon",
//   Abilities: [lightTheFuseAbility],
// };
//
