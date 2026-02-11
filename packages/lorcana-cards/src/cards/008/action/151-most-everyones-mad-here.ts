// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import {
//   MayBanish,
//   YouGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const mostEveryonesMadHere: LorcanitoActionCard = {
//   Id: "isu",
//   Name: "Most Everyone's Mad Here",
//   Characteristics: ["action"],
//   Text: "Gain lore equal to the damage on chosen character, then banish them.",
//   Type: "action",
//   Inkwell: false,
//   Colors: ["ruby"],
//   Cost: 7,
//   Illustrator: "Leonardo Giammichele",
//   Number: 151,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631451,
//   },
//   Rarity: "rare",
//   Abilities: [
//     {
//       Type: "resolution",
//       DependentEffects: true,
//       Effects: [
//         {
//           Type: "create-layer-based-on-target",
//           Target: chosenCharacter,
//           ResolveAmountBeforeCreatingLayer: true,
//           Effects: [
//             YouGainLore({
//               Dynamic: true,
//               Target: { attribute: "damage" },
//             }),
//           ],
//         },
//
//         MayBanish(chosenCharacter),
//       ],
//     },
//   ],
// };
//
