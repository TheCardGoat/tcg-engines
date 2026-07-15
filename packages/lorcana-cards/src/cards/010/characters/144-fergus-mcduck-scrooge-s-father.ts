// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Export const fergusMcduckScroogesFather: LorcanitoCharacterCard = {
//   Id: "pkp",
//   Name: "Fergus McDuck",
//   Title: "Scrooge's Father",
//   Characteristics: ["storyborn", "mentor"],
//   Text: "TOUGHEN UP When you play this character, chosen character of yours gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharacter({
//       Name: "TOUGHEN UP",
//       Text: "When you play this character, chosen character of yours gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)",
//       Effects: [
//         {
//           Type: "ability",
//           Ability: "ward",
//           Duration: "next_turn",
//           Until: true,
//           Modifier: "add",
//           Target: chosenCharacterOfYours,
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 3,
//   Strength: 3,
//   Willpower: 2,
//   Illustrator: "Kenneth Anderson",
//   Number: 144,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 659601,
//   },
//   Rarity: "common",
//   Lore: 2,
// };
//
