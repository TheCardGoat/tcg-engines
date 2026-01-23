import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseStylishSurfer: CharacterCard = {
  id: "1yy",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Stylish Surfer",
  fullName: "Minnie Mouse - Stylish Surfer",
  inkType: ["ruby"],
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  cardNumber: 113,
  inkable: true,
  externalIds: {
    ravensburger: "ffbe9beca8f3ff3eb0301baf5d2fe237571c4099",
  },
  abilities: [
    {
      id: "1yy-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const minnieMouseStylishSurfer: LorcanitoCharacterCard = {
//   id: "t1b",
//
//   name: "Minnie Mouse",
//   title: "Stylish Surfer",
//   characteristics: ["hero", "dreamborn"],
//   text: "**Evasive** _Only characters with Evasive can challenge this character._",
//   type: "character",
//   abilities: [evasiveAbility],
//   flavour: "This goes into my top ten most fun things!",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 1,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Mario Oscar Gabriele",
//   number: 113,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 526358,
//   },
//   rarity: "uncommon",
// };
//
