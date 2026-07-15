// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { youPayXLessToPlayNextCharThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const winnieThePoohHoneyPirateLookout: LorcanitoCharacterCard = {
//   Id: "vhr",
//   MissingTestCase: true,
//   Name: "Winnie the Pooh",
//   Title: "Hunny Pirate",
//   Characteristics: ["storyborn", "hero", "pirate"],
//   Text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\n\nWE'RE PIRATES, YOU SEE Whenever this character quests, the next Pirate character you play this turn costs 1 {I} less.",
//   Type: "character",
//   Abilities: [
//     SupportAbility,
//     WheneverQuests({
//       Name: "We're Pirates, You See",
//       Text: "Whenever this character quests, the next Pirate character you play this turn costs 1 {I} less.",
//       Effects: [
//         YouPayXLessToPlayNextCharThisTurn(1, [
//           { filter: "characteristics", value: ["pirate"] },
//         ]),
//       ],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["amber"],
//   Cost: 2,
//   Strength: 2,
//   Willpower: 2,
//   Lore: 1,
//   Illustrator: "Koni",
//   Number: 3,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 593050,
//   },
//   Rarity: "rare",
// };
//
