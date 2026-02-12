// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { wheneverOneOfYouCharactersIsBanished } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const trampDapperRascal: LorcanitoCharacterCard = {
//   Id: "xdy",
//   Name: "Tramp",
//   Title: "Dapper Rascal",
//   Characteristics: ["floodborn", "hero"],
//   Text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Tramp.)\nPLAY IT COOL During an opponent's turn, whenever one of your characters is banished, you may draw a card.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(4, "Tramp"),
//     WheneverOneOfYouCharactersIsBanished({
//       Name: "PLAY IT COOL",
//       Text: "During an opponent's turn, whenever one of your characters is banished, you may draw a card.",
//       Optional: true,
//       Conditions: [{ type: "during-turn", value: "opponent" }],
//       TriggerTarget: [
//         { filter: "type", value: "character" },
//         { filter: "owner", value: "self" },
//       ],
//       Effects: [drawACard],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amber", "emerald"],
//   Cost: 6,
//   Strength: 2,
//   Willpower: 8,
//   Illustrator: "Erika Wiseman",
//   Number: 22,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631366,
//   },
//   Rarity: "super_rare",
//   Lore: 2,
// };
//
