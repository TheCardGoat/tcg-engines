// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   CardEffectTarget,
//   ExertEffect,
//   HealEffect,
//   LorcanitoCharacterCard,
// } from "@lorcanito/lorcana-engine";
// Import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
//
// Const yourOtherDamageChars: CardEffectTarget = {
//   Type: "card",
//   Value: "all",
//   ExcludeSelf: true,
//   Filters: [
//     { filter: "owner", value: "self" },
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//     { filter: "status", value: "damaged" },
//   ],
// };
//
// Const readyYourOtherDamagedCharacters: ExertEffect = {
//   Type: "exert",
//   Exert: false,
//   Target: yourOtherDamageChars,
// };
//
// Const removeOneDamageFromYourOtherCharacters: HealEffect = {
//   Type: "heal",
//   Amount: 1,
//   UpTo: true,
//   Target: yourOtherDamageChars,
// };
//
// Export const goofyGroundbreakingChef: LorcanitoCharacterCard = {
//   Id: "a5y",
//   Name: "Goofy",
//   Title: "Groundbreaking Chef",
//   Characteristics: ["storyborn", "hero"],
//   Text: "PLENTY TO GO AROUND At the end of your turn, you may remove up to 1 damage from each of your other characters. Ready each character you removed damage from this way.",
//   Type: "character",
//   Abilities: [
//     AtTheEndOfYourTurn({
//       Name: "PLENTY TO GO AROUND",
//       Text: "At the end of your turn, you may remove up to 1 damage from each of your other characters. Ready each character you removed damage from this way.",
//       Optional: true,
//       Effects: [
//         ReadyYourOtherDamagedCharacters,
//         RemoveOneDamageFromYourOtherCharacters,
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 4,
//   Illustrator: "Carlos Luzzi",
//   Number: 4,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 632719,
//   },
//   Rarity: "legendary",
//   Lore: 2,
// };
//
