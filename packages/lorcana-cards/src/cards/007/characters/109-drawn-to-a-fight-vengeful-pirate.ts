// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { wheneverYouPlayAnActionNotASong } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// Const drawnToAFight = whenYouPlayThisForEachYouPayLess({
//   Name: "Drawn to a Fight",
//   Text: "If an opposing character was damaged this turn, you pay 2 {I} less to play this character.",
//   Conditions: [
//     {
//       Type: "this-turn",
//       Value: "was-damaged",
//       Target: "self",
//       Comparison: { operator: "gte", value: 1 },
//       Filters: [
//         { filter: "type", value: "character" },
//         { filter: "owner", value: "opponent" },
//       ],
//     },
//   ],
//   Amount: 2,
// });
//
// Const iAintGoneSoft = wheneverYouPlayAnActionNotASong({
//   Name: "I Ain't Gone Soft",
//   Text: "Whenever you play an action that isn't a song, you may deal 1 damage to chosen character.",
//   Optional: true,
//   Effects: [dealDamageEffect(1, chosenCharacter)],
// });
//
// Export const johnSilverVengefulPirate: LorcanitoCharacterCard = {
//   Id: "ox6",
//   Name: "John Silver",
//   Title: "Vengeful Pirate",
//   Characteristics: ["storyborn", "villain", "alien", "pirate", "captain"],
//   Text: "DRAWN TO A FIGHT If an opposing character was damaged this turn, you pay 2 {I} less to play this character.\nResist +1\nI AIN'T GONE SOFT! Whenever you play an action that isn't a song, you may deal 1 damage to chosen character.",
//   Type: "character",
//   Abilities: [drawnToAFight, resistAbility(1), iAintGoneSoft],
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 8,
//   Strength: 6,
//   Willpower: 4,
//   Illustrator: "Nicholas Kole",
//   Number: 109,
//   Set: "007",
//   ExternalIds: {
//     TcgPlayer: 619466,
//   },
//   Rarity: "rare",
//   Lore: 2,
// };
//
