import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaStouthearted: CharacterCard = {
  id: "h1c",
  cardType: "character",
  name: "Cinderella",
  version: "Stouthearted",
  fullName: "Cinderella - Stouthearted",
  inkType: ["steel"],
  franchise: "Cinderella",
  set: "002",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Cinderella.)\nResist +2 (Damage dealt to this character is reduced by 2.)\nTHE SINGING SWORD Whenever you play a song, this character may challenge ready characters this turn.",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 3,
  cardNumber: 177,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3d67840e2611347a4132ec418a46982679ab9939",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Princess", "Knight"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   resistAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const cinderellaStouthearted: LorcanitoCharacterCard = {
//   id: "m9m",
//   name: "Cinderella",
//   title: "Stouthearted",
//   characteristics: ["hero", "floodborn", "princess", "knight"],
//   type: "character",
//   text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Cinderella.)_<br>\n**Resist** +2 _(Damage dealt to this character is reduced by 2.)_<br>\n**THE SINGING SWORD** Whenever you play a song, this character may challenge ready characters this turn.",
//   abilities: [
//     shiftAbility(5, "cinderella"),
//     resistAbility(2),
//     whileConditionThisCharacterGains({
//       name: "The Singing Sword",
//       text: "Whenever you play a song, this character may challenge ready characters this turn.",
//       conditions: [{ type: "played-songs" }],
//       ability: {
//         type: "static",
//         ability: "challenge-ready-chars",
//       },
//     }),
//   ],
//   flavour: "Courage in the face of adversity.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 7,
//   strength: 5,
//   willpower: 5,
//   lore: 3,
//   illustrator: "Grace Tran",
//   number: 177,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 516391,
//   },
//   rarity: "super_rare",
// };
//
