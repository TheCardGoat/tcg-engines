// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   AnotherChosenCharacterOfYours,
//   ThisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { returnChosenCharacterWithCostLess } from "@lorcanito/lorcana-engine/effects/effects";
//
// Const doubleCross = whenYouPlayThis({
//   Name: "DOUBLE-CROSS",
//   Text: "When you play this character, you may deal 2 damage to another chosen character of yours to return chosen character with cost 2 or less to their player's hand.",
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
//           Effects: [returnChosenCharacterWithCostLess(2)],
//         },
//       ],
//     },
//   ],
// });
//
// Export const madameMedusaDeceivingPartner: LorcanitoCharacterCard = {
//   Id: "mzj",
//   Name: "Madame Medusa",
//   Title: "Deceiving Partner",
//   Characteristics: ["storyborn", "villain"],
//   Text: "DOUBLE-CROSS When you play this character, you may deal 2 damage to another chosen character of yours to return chosen character with cost 2 or less to their player's hand.",
//   Type: "character",
//   Abilities: [doubleCross],
//   Inkwell: true,
//   Colors: ["amethyst", "ruby"],
//   Cost: 3,
//   Strength: 3,
//   Willpower: 3,
//   Illustrator: "Heidi Neuhofter",
//   Number: 47,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631382,
//   },
//   Rarity: "uncommon",
//   Lore: 1,
// };
//
