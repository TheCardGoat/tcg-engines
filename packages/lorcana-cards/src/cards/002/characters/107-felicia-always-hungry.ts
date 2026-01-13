import type { CharacterCard } from "@tcg/lorcana-types";

export const feliciaAlwaysHungry: CharacterCard = {
  id: "7iz",
  cardType: "character",
  name: "Felicia",
  version: "Always Hungry",
  fullName: "Felicia - Always Hungry",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "Reckless (This character can't quest and must challenge each turn if able.)",
  cost: 1,
  strength: 3,
  willpower: 1,
  lore: 0,
  cardNumber: 107,
  inkable: true,
  externalIds: {
    ravensburger: "1b20de5f2b02e1b11d1cc8c4407911c249df3db3",
  },
  abilities: [
    {
      id: "7iz-1",
      type: "keyword",
      keyword: "Reckless",
      text: "Reckless",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { recklessAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const feliciaAlwaysHungry: LorcanitoCharacterCard = {
//   id: "trb",
//
//   name: "Felicia",
//   title: "Always Hungry",
//   characteristics: ["dreamborn", "ally"],
//   text: "**Reckless** _(This character can't quest and must challenge each turn if able.)_",
//   type: "character",
//   abilities: [recklessAbility],
//   flavour:
//     "This isn't how most cat-and-mouse games go, is it, Dr. Dawson? \n−Basil",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   strength: 3,
//   lore: 0,
//   willpower: 1,
//   illustrator: "Michael Cookie Niewiadomy",
//   number: 107,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527755,
//   },
//   rarity: "common",
// };
//
