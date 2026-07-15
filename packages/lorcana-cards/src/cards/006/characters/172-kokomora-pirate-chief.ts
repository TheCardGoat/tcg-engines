// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   ChosenCardFromYourHand,
//   ChosenCharacterOrLocation,
//   ThisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import {
//   DealDamageEffect,
//   DrawACard,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const kokomoraPirateChief: LorcanitoCharacterCard = {
//   Id: "lcy",
//   Name: "Kakamora",
//   Title: "Pirate Chief",
//   Characteristics: ["storyborn", "pirate", "captain"],
//   Text: "COCONUT LEADER Whenever this character quests, you may draw a card. Then, choose and discard a card to deal 1 damage to chosen character or location. If a Pirate character card was discarded, deal 3 damage to that character or location instead.",
//   Type: "character",
//   Abilities: [
//     WheneverQuests({
//       Name: "Coconut Leader",
//       Text: "Whenever this character quests, you may draw a card. Then, choose and discard a card to deal 1 damage to chosen character or location. If a Pirate character card was discarded, deal 3 damage to that character or location instead.",
//       Optional: true,
//       ResolveEffectsIndividually: true,
//       Effects: [
//         DrawACard,
//         {
//           Type: "discard",
//           Amount: 1,
//           Target: chosenCardFromYourHand,
//           AfterEffect: [
//             {
//               Type: "create-layer-based-on-target",
//               Filters: [{ filter: "characteristics", value: ["pirate"] }],
//               // TODO: get rid of target
//               Target: thisCharacter,
//               Effects: [dealDamageEffect(3, chosenCharacterOrLocation)],
//               Fallback: [dealDamageEffect(1, chosenCharacterOrLocation)],
//             },
//           ],
//         },
//       ],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["steel"],
//   Cost: 7,
//   Strength: 4,
//   Willpower: 6,
//   Lore: 2,
//   Illustrator: "Juan Diego Leon",
//   Number: 172,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 593018,
//   },
//   Rarity: "rare",
// };
//
