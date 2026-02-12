// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import {
//   ChosenCharacter,
//   ChosenDamagedCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import {
//   BanishChosenItem,
//   DealDamageEffect,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const makeThePotion: LorcanitoActionCard = {
//   Id: "vwt",
//   Reprints: ["iiv"],
//   MissingTestCase: true,
//   Name: "Make the Potion",
//   Characteristics: ["action"],
//   Text: "Choose one:\n· Banish chosen item.\n· Deal 2 damage to chosen damaged character.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Text: "Choose one:\n· Banish chosen item.\n· Deal 2 damage to chosen damaged character.",
//       Effects: [
//         {
//           Type: "modal",
//           Target: chosenCharacter,
//           Modes: [
//             {
//               Id: "1",
//               Text: "Banish chosen item",
//               Effects: [banishChosenItem],
//             },
//             {
//               Id: "2",
//               Text: "Deal 2 damage to chosen damaged character",
//               Effects: [dealDamageEffect(2, chosenDamagedCharacter)],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   Colors: ["emerald"],
//   Cost: 2,
//   Illustrator: "Elodie Mondoloni",
//   Number: 94,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 550585,
//   },
//   Rarity: "common",
// };
//
