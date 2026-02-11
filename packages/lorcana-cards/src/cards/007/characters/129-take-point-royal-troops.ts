// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { StaticAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whileADamagedCharacterIsInPlay } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Const takePoint: StaticAbility = {
//   Type: "static",
//   Name: "TAKE POINT",
//   Text: "While a damaged character is in play, this character gets +2 {S}.",
//   Conditions: [whileADamagedCharacterIsInPlay],
//   Ability: "effects",
//   Effects: [
//     {
//       Type: "attribute",
//       Attribute: "strength",
//       Amount: 2,
//       Modifier: "add",
//       Target: thisCharacter,
//       Duration: "static",
//     },
//   ],
// };
//
// Export const cardSoldiersRoyalTroops: LorcanitoCharacterCard = {
//   Id: "z86",
//   Name: "Card Soldiers",
//   Title: "Royal Troops",
//   Characteristics: ["storyborn", "ally"],
//   Text: "TAKE POINT While a damaged character is in play, this character gets +2 {S}.",
//   Type: "character",
//   Abilities: [takePoint],
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 1,
//   Strength: 1,
//   Willpower: 2,
//   Illustrator: "Kamil Murzyn",
//   Number: 129,
//   Set: "007",
//   ExternalIds: {
//     TcgPlayer: 618707,
//   },
//   Rarity: "common",
//   Lore: 1,
// };
//
