// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   EvasiveAbility,
//   ShiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Export const goGoTomagoCuttingEdge: LorcanitoCharacterCard = {
//   Id: "j8q",
//   Name: "Go Go Tomago",
//   Title: "Cutting Edge",
//   Characteristics: ["floodborn", "hero", "inventor"],
//   Text: "Shift 4\nEvasive (Only characters with Evasive can challenge this character.)\nZERO RESISTANCE When you play this character, if you used Shift to play her, you may put chosen character into their player's inkwell facedown and exerted.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(4, "Go Go Tomago"),
//     EvasiveAbility,
//     WhenYouPlayThisCharacter({
//       Name: "ZERO RESISTANCE",
//       Text: "When you play this character, if you used Shift to play her, you may put chosen character into their player's inkwell facedown and exerted.",
//       Conditions: [{ type: "resolution", value: "shift" }],
//       Optional: true,
//       Effects: [
//         {
//           Type: "move",
//           To: "inkwell",
//           Target: chosenCharacter,
//           IsPrivate: false,
//           Exerted: true,
//         },
//       ],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["emerald", "sapphire"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 3,
//   Illustrator: "Beno Mel",
//   Number: 107,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631687,
//   },
//   Rarity: "super_rare",
//   Lore: 2,
// };
//
