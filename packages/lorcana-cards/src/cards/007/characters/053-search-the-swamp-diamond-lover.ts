// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   AnotherChosenCharacterOfYours,
//   ThisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { chosenPlayerMillXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// Const searchInTheSwampAbility = wheneverQuests({
//   Name: "SEARCH THE SWAMP",
//   Text: "Whenever this character quests, you may deal 2 damage to another chosen character of yours to put the top 3 cards of chosen player's deck into their discard.",
//   Optional: true,
//   Effects: [
//     {
//       Type: "damage",
//       Amount: 2,
//       Target: anotherChosenCharacterOfYours,
//       AfterEffect: [
//         {
//           Type: "create-layer-based-on-target",
//           Target: thisCharacter,
//           Effects: [
//             ChosenPlayerMillXCards({
//               Amount: 3,
//               Name: "Search the Swamp",
//               Text: "put the top 3 cards of chosen player's deck into their discard.",
//             }),
//           ],
//         },
//       ],
//     },
//   ],
// });
//
// Export const madameMedusaDiamondLover: LorcanitoCharacterCard = {
//   Id: "ekw",
//   Name: "Madame Medusa",
//   Title: "Diamond Lover",
//   Characteristics: ["storyborn", "villain"],
//   Text: "SEARCH THE SWAMP Whenever this character quests, you may deal 2 damage to another chosen character of yours to put the top 3 cards of chosen player's deck into their discard.",
//   Type: "character",
//   Abilities: [searchInTheSwampAbility],
//   Inkwell: true,
//   Colors: ["amethyst", "ruby"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 4,
//   Illustrator: "Roger Perez",
//   Number: 53,
//   Set: "007",
//   ExternalIds: {
//     TcgPlayer: 618696,
//   },
//   Rarity: "uncommon",
//   Lore: 1,
// };
//
