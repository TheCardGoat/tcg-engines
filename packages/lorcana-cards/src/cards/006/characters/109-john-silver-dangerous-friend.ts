// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { anotherChosenCharOfYours } from "@lorcanito/lorcana-engine/abilities/target";
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import {
//   DealDamageEffect,
//   ReadyAndCantQuest,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const johnSilverDangerousFriend: LorcanitoCharacterCard = {
//   Id: "o9c",
//   MissingTestCase: true,
//   Name: "John Silver",
//   Title: "Ferocious Friend",
//   Characteristics: ["storyborn", "villain", "alien", "pirate", "captain"],
//   Text: "YOU HAVE TO CHART YOUR OWN COURSE Whenever this character quests, you may deal 1 damage to one of your other characters. If you do, ready that character. They cannot quest this turn.",
//   Type: "character",
//   Abilities: [
//     WheneverQuests({
//       Name: "You Have To Chart Your Own Course",
//       Text: "Whenever this character quests, you may deal 1 damage to one of your other characters. If you do, ready that character. They cannot quest this turn.",
//       Optional: true,
//       Effects: [
//         DealDamageEffect(1, anotherChosenCharOfYours),
//         ...readyAndCantQuest(anotherChosenCharOfYours),
//       ],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["ruby"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "César Vergara",
//   Number: 109,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 591121,
//   },
//   Rarity: "uncommon",
// };
//
