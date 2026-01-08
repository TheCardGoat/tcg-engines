import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseBraveLittleTailor: CharacterCard = {
  id: "a81",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Brave Little Tailor",
  fullName: "Mickey Mouse - Brave Little Tailor",
  inkType: ["ruby"],
  set: "001",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 8,
  strength: 5,
  willpower: 5,
  lore: 4,
  cardNumber: 115,
  inkable: true,
  externalIds: {
    ravensburger: "24d9608bc36bf0e9c6e158b0569ebcd8d0515343",
  },
  abilities: [
    {
      id: "a81-1",
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
// export const mickeyBraveLittleTailor: LorcanitoCharacterCard = {
//   id: "ygl",
//   name: "Mickey Mouse",
//   title: "Brave Little Tailor",
//   characteristics: ["hero", "dreamborn"],
//   text: "Evasive",
//   type: "character",
//   abilities: [evasiveAbility],
//   flavour:
//     "When defeat looms and victory hangs by a thread, a hero bolts to the rescue, patching things up through shear determination.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 8,
//   strength: 5,
//   willpower: 5,
//   lore: 4,
//   illustrator: "Nicholas Kole",
//   number: 115,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508785,
//   },
//   rarity: "legendary",
// };
//
