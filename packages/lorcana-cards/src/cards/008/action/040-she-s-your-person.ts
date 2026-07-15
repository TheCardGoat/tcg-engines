// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   CardEffectTarget,
//   LorcanitoActionCard,
//   ResolutionAbility,
// } from "@lorcanito/lorcana-engine";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Const eachOfYourCharactersWithBodyGuard: CardEffectTarget = {
//   Type: "card",
//   Value: "all",
//   Filters: [
//     { filter: "owner", value: "self" },
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//     { filter: "ability", value: "bodyguard" },
//   ],
// };
//
// Const shesYourPersonAbility: ResolutionAbility = {
//   Type: "resolution",
//   Effects: [
//     {
//       Type: "modal",
//       // TODO: Get rid of target
//       Target: chosenCharacter,
//       Modes: [
//         {
//           Id: "1",
//           Text: "Remove up to 3 damage from chosen character.",
//           Effects: [
//             {
//               Type: "heal",
//               Amount: 3,
//               UpTo: true,
//               Target: chosenCharacter,
//             },
//           ],
//         },
//         {
//           Id: "2",
//           Text: "Remove up to 3 damage from each of your characters with Bodyguard.",
//           Effects: [
//             {
//               Type: "heal",
//               Amount: 3,
//               UpTo: true,
//               Target: eachOfYourCharactersWithBodyGuard,
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
//
// Export const shesYourPerson: LorcanitoActionCard = {
//   Id: "u6y",
//   Name: "She's Your Person",
//   Characteristics: ["action"],
//   Text: "Choose one:\n• Remove up to 3 damage from chosen character.\n• Remove up to 3 damage from each of your characters with Bodyguard.",
//   Type: "action",
//   Inkwell: true,
//   Colors: ["amber", "steel"],
//   Cost: 1,
//   Illustrator: "Sergio Márquez",
//   Number: 40,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631378,
//   },
//   Rarity: "uncommon",
//   Abilities: [shesYourPersonAbility],
// };
//
