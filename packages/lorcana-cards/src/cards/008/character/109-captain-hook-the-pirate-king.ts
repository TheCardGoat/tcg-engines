// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { allYourCharacteristicCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverOppCharIsDamaged } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import {
//   getStrengthThisTurn,
//   targetCardGainsResist,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const captainHookThePirateKing: LorcanitoCharacterCard = {
//   id: "kfs",
//   name: "Captain Hook",
//   title: "The Pirate King",
//   characteristics: ["floodborn", "villain", "king", "pirate", "captain"],
//   text: "SHIFT 3 (You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)\nGIVE 'EM ALL YOU GOT! Once during your turn, whenever an opposing character is damaged, your Pirate characters get +2 {S} and gain Resist +2 this turn. (Damage dealt to them is reduced by 2.)",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "Captain Hook"),
//     wheneverOppCharIsDamaged({
//       name: "GIVE 'EM ALL YOU GOT!",
//       text: "Once during your turn, whenever an opposing character is damaged, your Pirate characters get +2 {S} and gain Resist +2 this turn. (Damage dealt to them is reduced by 2.)",
//       oncePerTurn: true,
//       effects: [
//         targetCardGainsResist({
//           amount: 2,
//           duration: "turn",
//           target: allYourCharacteristicCharacters(["pirate"]),
//         }),
//         getStrengthThisTurn(2, allYourCharacteristicCharacters(["pirate"])),
//       ],
//       conditions: [duringYourTurn],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald", "steel"],
//   cost: 5,
//   strength: 4,
//   willpower: 5,
//   illustrator: "Kenneth Anderson",
//   number: 109,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631420,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
