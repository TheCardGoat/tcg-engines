import type { CharacterCard } from "@tcg/lorcana-types";

export const theTroubadourMusicalNarrator: CharacterCard = {
  id: "1is",
  cardType: "character",
  name: "The Troubadour",
  version: "Musical Narrator",
  fullName: "The Troubadour - Musical Narrator",
  inkType: ["amber", "steel"],
  set: "007",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)\nSinger 4 (This character counts as cost 4 to sing songs.)",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 11,
  inkable: true,
  externalIds: {
    ravensburger: "c57710fd5e34103000a17c6eedbbbdf775ab07ec",
  },
  abilities: [
    {
      id: "1is-1",
      type: "keyword",
      keyword: "Resist",
      value: 1,
      text: "Resist +1",
    },
    {
      id: "1is-2",
      type: "keyword",
      keyword: "Singer",
      value: 4,
      text: "Singer 4",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   resistAbility,
//   singerAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const theTroubadourMusicalNarrator: LorcanitoCharacterCard = {
//   id: "jh3",
//   name: "The Troubadour",
//   title: "Musical Narrator",
//   characteristics: ["storyborn", "ally"],
//   text: "Resist +1\nSinger 4",
//   type: "character",
//   abilities: [resistAbility(1), singerAbility(4)],
//   inkwell: true,
//
//   colors: ["amber", "steel"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   illustrator: "Carmine Pucci",
//   number: 11,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618128,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
