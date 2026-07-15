// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { chosenItemOrLocation } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import {
//   MayBanish,
//   YouGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const wreckitRalphHamHands: LorcanitoCharacterCard = {
//   Id: "td0",
//   MissingTestCase: true,
//   Name: "Wreck-it Ralph",
//   Title: "Ham Hands",
//   Characteristics: ["dreamborn", "hero"],
//   Text: "I WRECK THINGS Whenever this character quests, you may banish chosen item or location to gain 2 lore.",
//   Type: "character",
//   Abilities: [
//     WheneverQuests({
//       Name: "I Wreck Things",
//       Text: "Whenever this character quests, you may banish chosen item or location to gain 2 lore.",
//       Optional: true,
//       Effects: [mayBanish(chosenItemOrLocation), youGainLore(2)],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["steel"],
//   Cost: 6,
//   Strength: 4,
//   Willpower: 4,
//   Lore: 3,
//   Illustrator: "Justin Runfola",
//   Number: 190,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 590821,
//   },
//   Rarity: "legendary",
// };
//
