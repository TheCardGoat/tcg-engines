import type { CharacterCard } from "@tcg/lorcana-types";

export const scarTempestuousLion: CharacterCard = {
  id: "ug5",
  cardType: "character",
  name: "Scar",
  version: "Tempestuous Lion",
  fullName: "Scar - Tempestuous Lion",
  inkType: ["amethyst"],
  franchise: "Lion King",
  set: "006",
  text: "Rush (This character can challenge the turn they're played.)\nChallenger +3 (While challenging, this character gets +3 {S}.)",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 47,
  inkable: false,
  externalIds: {
    ravensburger: "6dbd6b03dc064b8f9f8f15ddaa470e7b5632a534",
  },
  abilities: [
    {
      id: "ug5-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
    {
      id: "ug5-2",
      type: "keyword",
      keyword: "Challenger",
      value: 3,
      text: "Challenger +3",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   challengerAbility,
//   rushAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const scarTempestuousLion: LorcanitoCharacterCard = {
//   id: "i6n",
//   name: "Scar",
//   title: "Tempestuous Lion",
//   characteristics: ["dreamborn", "villain", "sorcerer"],
//   text: "Rush (This character can challenge the turn they're played.)\nChallenger +3 (While challenging, this character gets +3 {S}.)",
//   type: "character",
//   abilities: [rushAbility, challengerAbility(3)],
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 6,
//   strength: 4,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Peter Broeckhammer",
//   number: 47,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588320,
//   },
//   rarity: "uncommon",
// };
//
