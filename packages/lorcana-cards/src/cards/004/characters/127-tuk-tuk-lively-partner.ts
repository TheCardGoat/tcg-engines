// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import {
//   ChosenCharacterOfYoursIncludingSelf,
//   ChosenOtherCharacterOfYours,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { moveToLocation } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const tukTukLivelyPartner: LorcanitoCharacterCard = {
//   Id: "fjt",
//   Reprints: ["lts"],
//   Name: "Tuk Tuk",
//   Title: "Lively Partner",
//   Characteristics: ["ally"],
//   Text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n\n**ON A ROLL** When you play this character, you may move him and one of your other characters to the same location for free. The other character gets +2 {S} this turn.",
//   Type: "character",
//   Abilities: [
//     EvasiveAbility,
//     {
//       Type: "resolution",
//       Name: "ON A ROLL",
//       Text: "When you play this character, you may move him and one of your other characters to the same location for free. The other character gets +2 {S} this turn.",
//       Optional: true,
//       DependentEffects: true,
//       Effects: [
//         MoveToLocation(chosenCharacterOfYoursIncludingSelf),
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Amount: 2,
//           Modifier: "add",
//           Duration: "turn",
//           Target: chosenOtherCharacterOfYours,
//         },
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 3,
//   Strength: 2,
//   Willpower: 3,
//   Lore: 1,
//   Illustrator: "Sandra Rios",
//   Number: 127,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 549619,
//   },
//   Rarity: "rare",
// };
//
