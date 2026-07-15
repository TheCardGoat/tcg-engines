// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import {
//   ChosenCharacterOfYours,
//   ChosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const lastDitchEffort: LorcanitoActionCard = {
//   Id: "b2t",
//   Reprints: ["qq2"],
//   Name: "Last-Ditch Effort",
//   Characteristics: ["action"],
//   Text: "Exert chosen opposing character. Then chosen character of yours gains **Challenger** +2 this turn. (They get +2 {S} while challenging.)",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       ResolveEffectsIndividually: true,
//       Effects: [
//         {
//           Type: "exert",
//           Exert: true,
//           Target: chosenOpposingCharacter,
//         },
//         {
//           Type: "ability",
//           Ability: "challenger",
//           Amount: 2,
//           Modifier: "add",
//           Duration: "turn",
//           Until: true,
//           Target: chosenCharacterOfYours,
//         },
//       ],
//     },
//   ],
//   Flavour: "I got your back",
//   Colors: ["amethyst"],
//   Cost: 3,
//   Illustrator: "Ian MacDonald",
//   Number: 62,
//   Set: "ITI",
//   ExternalIds: {
//     TcgPlayer: 538230,
//   },
//   Rarity: "uncommon",
// };
//
