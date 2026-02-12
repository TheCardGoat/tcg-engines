// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverTargetPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const princeJohnFraidycat: LorcanitoCharacterCard = {
//   Id: "ed5",
//   Name: "Prince John",
//   Title: "Fraidy-Cat",
//   Characteristics: ["storyborn", "villain", "prince"],
//   Text: "HELP! HELP! Whenever an opponent plays a character, deal 1 damage to this character.",
//   Type: "character",
//   Inkwell: false,
//   Colors: ["ruby"],
//   Cost: 3,
//   Strength: 5,
//   Willpower: 5,
//   Illustrator: "Denny Minonne",
//   Number: 146,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631446,
//   },
//   Rarity: "rare",
//   Lore: 1,
//   Abilities: [
//     WheneverTargetPlays({
//       Name: "HELP! HELP!",
//       Text: "Whenever an opponent plays a character, deal 1 damage to this character.",
//       TriggerFilter: [
//         { filter: "owner", value: "opponent" },
//         { filter: "type", value: "character" },
//         { filter: "zone", value: "play" },
//       ],
//       Effects: [dealDamageEffect(1, thisCharacter)],
//     }),
//   ],
// };
//
