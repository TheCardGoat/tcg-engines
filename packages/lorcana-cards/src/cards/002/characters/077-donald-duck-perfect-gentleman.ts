// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// Import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const donaldDuckPerfectGentleman: LorcanitoCharacterCard = {
//   Id: "pgk",
//   Reprints: ["g8a"],
//   Name: "Donald Duck",
//   Title: "Perfect Gentleman",
//   Characteristics: ["floodborn", "ally"],
//   Text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Donald Duck._)\n**ALLOW ME** At the start of your turn, each player may draw a card.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(3, "donald duck"),
//     AtTheStartOfYourTurn({
//       Name: "OWNER PLAYER Allow Me",
//       Text: "At the start of your turn, each player may draw a card.",
//       Effects: [
//         {
//           Type: "create-layer-for-player",
//           Target: opponent,
//           Layer: {
//             Type: "resolution",
//             Name: "OPPO PLAYER Allow Me",
//             Text: "At the start of your turn, each player may draw a card.",
//             Optional: true,
//             Responder: "opponent",
//             Effects: [drawACard],
//           },
//         },
//         {
//           Type: "create-layer-for-player",
//           Target: self,
//           Layer: {
//             Type: "resolution",
//             Responder: "self",
//             Name: "OWNER PLAYER Allow Me",
//             Text: "You may draw a card.",
//             Optional: true,
//             Effects: [drawACard],
//           },
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Ron Baird",
//   Number: 77,
//   Set: "ROF",
//   ExternalIds: {
//     TcgPlayer: 526207,
//   },
//   Rarity: "uncommon",
// };
//
