// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const jafarPowerhungryVizier: LorcanitoCharacterCard = {
//   Id: "psh",
//   MissingTestCase: true,
//   Name: "Jafar",
//   Title: "Power‐Hungry Vizier",
//   Characteristics: ["dreamborn", "villain", "sorcerer"],
//   Text: "YOU WILL BE PAID WHEN THE TIME COMES During your turn, whenever a card is put into your inkwell, deal 1 damage to chosen character.",
//   Type: "character",
//   Abilities: [
//     WheneverACardIsPutIntoYourInkwell({
//       Name: "You Will Be Paid When The Time Comes",
//       Text: "During your turn, whenever a card is put into your inkwell, deal 1 damage to chosen character.",
//       Conditions: [{ type: "during-turn", value: "self" }],
//       Effects: [dealDamageEffect(1, chosenCharacter)],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["steel"],
//   Cost: 5,
//   Strength: 3,
//   Willpower: 4,
//   Lore: 1,
//   Illustrator: "Federico Maria Cugliari",
//   Number: 193,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 591118,
//   },
//   Rarity: "super_rare",
// };
//
