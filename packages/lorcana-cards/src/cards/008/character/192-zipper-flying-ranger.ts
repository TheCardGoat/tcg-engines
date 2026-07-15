// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   DuringYourTurnThisCharacterGains,
//   EvasiveAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Export const zipperFlyingRanger: LorcanitoCharacterCard = {
//   Id: "ql7",
//   Name: "Zipper",
//   Title: "Flying Ranger",
//   Characteristics: ["storyborn", "ally"],
//   Text: "BEST MATES If you have a character named Monterey Jack in play, you pay 1 {I} less to play this character.\nBURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisForEachYouPayLess({
//       Name: "BEST MATES",
//       Text: "If you have a character named Monterey Jack in play, you pay 1 {I} less to play this character.",
//       Amount: 1,
//       Conditions: [ifYouHaveCharacterNamed("Monterey Jack")],
//     }),
//     DuringYourTurnThisCharacterGains({
//       Name: "BURST OF SPEED",
//       Text: "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
//       Ability: evasiveAbility,
//       Conditions: [],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 3,
//   Strength: 2,
//   Willpower: 4,
//   Illustrator: "Ian MacDonald",
//   Number: 192,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631476,
//   },
//   Rarity: "uncommon",
//   Lore: 1,
// };
//
