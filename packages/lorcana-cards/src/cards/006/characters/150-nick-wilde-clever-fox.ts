// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { haveItemInPlay } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// Export const nickWildeCleverFox: LorcanitoCharacterCard = {
//   Id: "b7c",
//   Name: "Nick Wilde",
//   Title: "Sly Fox",
//   Characteristics: ["floodborn", "ally"],
//   Text: "Shift 1 (You may pay 1 {I} to play this on top of one of your characters named Nick Wilde.)\nCAN'T TOUCH ME While you have an item in play, this character can't be challenged.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(1, "Nick Wilde"),
//     WhileConditionThisCharacterGains({
//       Name: "Can't Touch Me",
//       Text: "While you have an item in play, this character can't be challenged.",
//       Conditions: [haveItemInPlay],
//       Ability: {
//         Type: "static",
//         Ability: "effects",
//         Effects: [
//           {
//             Type: "restriction",
//             Restriction: "be-challenged",
//             Target: thisCharacter,
//           },
//         ],
//       },
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 3,
//   Strength: 1,
//   Willpower: 3,
//   Lore: 1,
//   Illustrator: "João Moura",
//   Number: 150,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 591133,
//   },
//   Rarity: "uncommon",
// };
//
