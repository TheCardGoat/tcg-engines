import type { CharacterCard } from "@tcg/lorcana-types";

export const tiggerWonderfulThing: CharacterCard = {
  id: "1cg",
  cardType: "character",
  name: "Tigger",
  version: "Wonderful Thing",
  fullName: "Tigger - Wonderful Thing",
  inkType: ["ruby"],
  franchise: "Winnie the Pooh",
  set: "001",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 127,
  inkable: true,
  externalIds: {
    ravensburger: "aeb12d5f9810897355e57f169ef318f584e11c64",
  },
  abilities: [
    {
      id: "1cg-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Tigger"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const tiggerWonderfulThing: LorcanitoCharacterCard = {
//   id: "a3y",
//
//   name: "Tigger",
//   title: "Wonderful Thing",
//   characteristics: ["storyborn", "tigger"],
//   text: "**Evasive** (_Only characters with Evasive can challenge this character._)",
//   type: "character",
//   rarity: "uncommon",
//   abilities: [evasiveAbility],
//   flavour: '"I\'m the bounciest bouncer that ever bounced!"',
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 6,
//   strength: 4,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Kenneth Anderson",
//   number: 127,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 489638,
//   },
// };
//
