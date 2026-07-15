// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { ifYouHaveAnotherPirate } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { chosenCharacterOrLocation } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const kakamoraLongrangeSpecialist: LorcanitoCharacterCard = {
//   Id: "zdx",
//   Name: "Kakamora",
//   Title: "Long-Range Specialist",
//   Characteristics: ["storyborn", "pirate"],
//   Text: "A LITTLE HELP When you play this character, if you have another Pirate character in play, you may deal 1 damage to chosen character or location.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharacter({
//       Name: "A Little Help",
//       Text: "When you play this character, if you have another Pirate character in play, you may deal 1 damage to chosen character or location.",
//       Optional: true,
//       Conditions: [ifYouHaveAnotherPirate],
//       Effects: [dealDamageEffect(1, chosenCharacterOrLocation)],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["steel"],
//   Cost: 1,
//   Strength: 0,
//   Willpower: 2,
//   Lore: 1,
//   Illustrator: "Matthew Robert Davies",
//   Number: 171,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 588366,
//   },
//   Rarity: "common",
// };
//
