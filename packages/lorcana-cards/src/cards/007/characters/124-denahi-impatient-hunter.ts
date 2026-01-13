import type { CharacterCard } from "@tcg/lorcana-types";

export const denahiImpatientHunter: CharacterCard = {
  id: "8xy",
  cardType: "character",
  name: "Denahi",
  version: "Impatient Hunter",
  fullName: "Denahi - Impatient Hunter",
  inkType: ["ruby", "steel"],
  franchise: "Brother Bear",
  set: "007",
  text: "Reckless (This character can't quest and must challenge each turn if able.)\nResist +2 (Damage dealt to this character is reduced by 2.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 0,
  cardNumber: 124,
  inkable: true,
  externalIds: {
    ravensburger: "203ba2afbe930769d683d5bcc2b361b27d68c85a",
  },
  abilities: [
    {
      id: "8xy-1",
      type: "keyword",
      keyword: "Reckless",
      text: "Reckless",
    },
    {
      id: "8xy-2",
      type: "keyword",
      keyword: "Resist",
      value: 2,
      text: "Resist +2",
    },
  ],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   recklessAbility,
//   resistAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const denahiImpatientHunter: LorcanitoCharacterCard = {
//   id: "lb2",
//   name: "Denahi",
//   title: "Impatient Hunter",
//   characteristics: ["storyborn"],
//   text: "Reckless\nResist +2",
//   type: "character",
//   abilities: [recklessAbility, resistAbility(2)],
//   inkwell: true,
//   colors: ["ruby", "steel"],
//   cost: 3,
//   strength: 3,
//   willpower: 2,
//   illustrator: "Brian Weisz",
//   number: 124,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618144,
//   },
//   rarity: "uncommon",
//   lore: 0,
// };
//
