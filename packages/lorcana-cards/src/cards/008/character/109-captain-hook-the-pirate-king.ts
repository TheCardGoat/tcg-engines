// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { allYourCharacteristicCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverOppCharIsDamaged } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import {
//   GetStrengthThisTurn,
//   TargetCardGainsResist,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const captainHookThePirateKing: LorcanitoCharacterCard = {
//   Id: "kfs",
//   Name: "Captain Hook",
//   Title: "The Pirate King",
//   Characteristics: ["floodborn", "villain", "king", "pirate", "captain"],
//   Text: "SHIFT 3 (You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)\nGIVE 'EM ALL YOU GOT! Once during your turn, whenever an opposing character is damaged, your Pirate characters get +2 {S} and gain Resist +2 this turn. (Damage dealt to them is reduced by 2.)",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(3, "Captain Hook"),
//     WheneverOppCharIsDamaged({
//       Name: "GIVE 'EM ALL YOU GOT!",
//       Text: "Once during your turn, whenever an opposing character is damaged, your Pirate characters get +2 {S} and gain Resist +2 this turn. (Damage dealt to them is reduced by 2.)",
//       OncePerTurn: true,
//       Effects: [
//         TargetCardGainsResist({
//           Amount: 2,
//           Duration: "turn",
//           Target: allYourCharacteristicCharacters(["pirate"]),
//         }),
//         GetStrengthThisTurn(2, allYourCharacteristicCharacters(["pirate"])),
//       ],
//       Conditions: [duringYourTurn],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["emerald", "steel"],
//   Cost: 5,
//   Strength: 4,
//   Willpower: 5,
//   Illustrator: "Kenneth Anderson",
//   Number: 109,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631420,
//   },
//   Rarity: "rare",
//   Lore: 2,
// };
//
