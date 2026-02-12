// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const healWhatHasBeenHurt: LorcanitoActionCard = {
//   Id: "ao1",
//   Reprints: ["z47"],
//   Name: "Heal What Has Been Hurt",
//   Characteristics: ["action", "song"],
//   Text: "_(A character with cost 3 or more can {E} to sing this song for free.)_\n \nRemove up to 3 damage from chosen character. Draw a card.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Heal What Has Been Hurt",
//       Text: "Remove up to 3 damage from chosen character. Draw a card.",
//       ResolveEffectsIndividually: true,
//       Effects: [
//         {
//           Type: "heal",
//           Amount: 3,
//           UpTo: true,
//           Target: chosenCharacter,
//         },
//         DrawACard,
//       ],
//     },
//   ],
//   Flavour: "Let your power shine \nMake the clock reverse . . .",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 3,
//   Illustrator: "Monica Catalano",
//   Number: 26,
//   Set: "ITI",
//   ExternalIds: {
//     TcgPlayer: 532523,
//   },
//   Rarity: "common",
// };
//
