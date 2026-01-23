import type { CharacterCard } from "@tcg/lorcana-types";

export const ratiganCriminalMastermind: CharacterCard = {
  id: "952",
  cardType: "character",
  name: "Ratigan",
  version: "Criminal Mastermind",
  fullName: "Ratigan - Criminal Mastermind",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 4,
  strength: 4,
  willpower: 1,
  lore: 2,
  cardNumber: 91,
  inkable: true,
  externalIds: {
    ravensburger: "20f1cee3efa42ca0bdb7295992b0b9f485f9c40e",
  },
  abilities: [
    {
      id: "952-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const ratiganCriminalMastermind: LorcanitoCharacterCard = {
//   id: "r5c",
//   name: "Ratigan",
//   title: "Criminal Mastermind",
//   characteristics: ["dreamborn", "villain"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_",
//   type: "character",
//   abilities: [evasiveAbility],
//   flavour:
//     "I've outdone myself this time! Soon I will have everything I deserve. Riches . . . power . . . an entire kingdom at my feet!",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 4,
//   willpower: 1,
//   lore: 2,
//   illustrator: "Michaela Martin",
//   number: 91,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527750,
//   },
//   rarity: "common",
// };
//
