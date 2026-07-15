// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import {
//   ChosenCharacter,
//   OpposingCharactersWithEvasive,
//   OpposingCharactersWithoutEvasive,
// } from "@lorcanito/lorcana-engine/abilities/target";
// Import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const tugofwar: LorcanitoActionCard = {
//   Id: "r3r",
//   Name: "Tug-of-War",
//   Characteristics: ["action"],
//   Text: "Choose one:<br>• Deal 1 damage to each opposing character without **Evasive**.<br>• Deal 3 damage to each opposing character with **Evasive**.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "modal",
//           // TODO: Get rid of target
//           Target: chosenCharacter,
//           Modes: [
//             {
//               Id: "1",
//               Text: "Deal 1 damage to each opposing character without **Evasive**.",
//               Effects: [dealDamageEffect(1, opposingCharactersWithoutEvasive)],
//             },
//             {
//               Id: "2",
//               Text: "Deal 3 damage to each opposing character with **Evasive**.",
//               Effects: [dealDamageEffect(3, opposingCharactersWithEvasive)],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 5,
//   Illustrator: "Maxine Vee",
//   Number: 196,
//   Set: "SSK",
//   ExternalIds: {
//     TcgPlayer: 557731,
//   },
//   Rarity: "rare",
// };
//
