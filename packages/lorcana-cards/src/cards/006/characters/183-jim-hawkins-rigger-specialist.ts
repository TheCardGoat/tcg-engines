// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { chosenCharacterOrLocation } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const jimHawkinsRiggerSpecialist: LorcanitoCharacterCard = {
//   Id: "wxe",
//   MissingTestCase: true,
//   Name: "Jim Hawkins",
//   Title: "Rigging Specialist",
//   Characteristics: ["floodborn", "hero"],
//   Text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Jim Hawkins.)\nBATTLE STATION When you play this character, you may deal 1 damage to chosen character or location.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(3, "Jim Hawkins"),
//     WhenYouPlayThis({
//       Name: "Battle Station",
//       Text: "When you play this character, you may deal 1 damage to chosen character or location.",
//       Optional: true,
//       Effects: [dealDamageEffect(1, chosenCharacterOrLocation)],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["steel"],
//   Cost: 5,
//   Strength: 5,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Ornella Savarese",
//   Number: 183,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 593015,
//   },
//   Rarity: "uncommon",
// };
//
