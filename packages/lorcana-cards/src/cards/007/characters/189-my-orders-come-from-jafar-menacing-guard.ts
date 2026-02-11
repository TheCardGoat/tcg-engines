// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { chosenItem } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { mayBanish } from "@lorcanito/lorcana-engine/effects/effects";
//
// Const myOrdersComeFromJafar = whenYouPlayThisCharacter({
//   Name: "MY ORDERS COME FROM JAFAR",
//   Text: "When you play this character, if you have a character named Jafar in play, you may banish chosen item.",
//   Conditions: [ifYouHaveCharacterNamed("Jafar")],
//   Optional: true,
//   Effects: [mayBanish(chosenItem)],
// });
//
// Export const razoulMenacingGuard: LorcanitoCharacterCard = {
//   Id: "awb",
//   Name: "Razoul",
//   Title: "Menacing Guard",
//   Characteristics: ["dreamborn", "ally", "captain"],
//   Text: "MY ORDERS COME FROM JAFAR When you play this character, if you have a character named Jafar in play, you may banish chosen item.",
//   Type: "character",
//   Abilities: [myOrdersComeFromJafar],
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 2,
//   Strength: 1,
//   Willpower: 3,
//   Illustrator: "Carlos Luzzi",
//   Number: 189,
//   Set: "007",
//   ExternalIds: {
//     TcgPlayer: 619516,
//   },
//   Rarity: "common",
//   Lore: 1,
// };
//
