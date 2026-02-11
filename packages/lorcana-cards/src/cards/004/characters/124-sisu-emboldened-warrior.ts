// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const sisuEmboldenedWarrior: LorcanitoCharacterCard = {
//   Id: "m8s",
//   Reprints: ["g9x"],
//   Name: "Sisu",
//   Title: "Emboldened Warrior",
//   Characteristics: ["hero", "storyborn", "dragon", "deity"],
//   Text: "**SURGE OF POWER** This character gets +1 {S} for each card in opponent's hands.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Ability: "effects",
//       Name: "SURGE OF POWER",
//       Text: "This character gets +1 {S} for each card in opponent's hands.",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Amount: {
//             Dynamic: true,
//             Filters: [
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//           Modifier: "add",
//           Target: thisCharacter,
//         },
//       ],
//     },
//   ],
//   Flavour:
//     "Sometimes the only way to fight the unimaginable is with the incredible.",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 3,
//   Strength: 1,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "LadyShalirin",
//   Number: 124,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 547778,
//   },
//   Rarity: "rare",
// };
//
