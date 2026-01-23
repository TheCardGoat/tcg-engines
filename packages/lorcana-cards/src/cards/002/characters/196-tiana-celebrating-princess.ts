import type { CharacterCard } from "@tcg/lorcana-types";

export const tianaCelebratingPrincess: CharacterCard = {
  id: "14e",
  cardType: "character",
  name: "Tiana",
  version: "Celebrating Princess",
  fullName: "Tiana - Celebrating Princess",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "002",
  text: "Resist +2 (Damage dealt to this character is reduced by 2.)\nWHAT YOU GIVE IS WHAT YOU GET While this character is exerted and you have no cards in your hand, opponents can't play actions.",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 196,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "910acc88a200a28dc9c862c38ead8d1f52ae921c",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   resistAbility,
//   type StaticAbilityWithEffect,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { opponentCantPlayActions } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const tianaCelebratingPrincess: LorcanitoCharacterCard = {
//   id: "nyj",
//   name: "Tiana",
//   title: "Celebrating Princess",
//   characteristics: ["hero", "dreamborn", "princess"],
//   text: "**Resist** +2 _(Damage dealt to this character is reduced by 2.)_\n\n**WHAT YOU GIVE IS WHAT YOU GET** While this character is exerted and you have no cards in your hand, opponents can't play actions.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "What You Give Is What You Get",
//       text: "While this character is exerted and you have no cards in your hand, opponents can't play actions.",
//       conditions: [
//         { type: "hand", amount: 0, player: "self" },
//         { type: "exerted" },
//       ],
//       effects: [opponentCantPlayActions],
//     } as StaticAbilityWithEffect,
//     resistAbility(2),
//   ],
//   colors: ["steel"],
//   cost: 4,
//   strength: 1,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Matthew Robert Davies",
//   number: 196,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 516398,
//   },
//   rarity: "super_rare",
// };
//
