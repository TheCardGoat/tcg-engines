import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesClumsyKid: CharacterCard = {
  id: "1l5",
  cardType: "character",
  name: "Hercules",
  version: "Clumsy Kid",
  fullName: "Hercules - Clumsy Kid",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "004",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 108,
  inkable: false,
  externalIds: {
    ravensburger: "ce69a0c9df8b79208d330486269074d53266f7ac",
  },
  abilities: [
    {
      id: "1l5-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const herculesClumsyKid: LorcanitoCharacterCard = {
//   id: "gyy",
//   name: "Hercules",
//   title: "Clumsy Kid",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**Rush** _(This character can challenge the turn they're played.)_",
//   type: "character",
//   abilities: [rushAbility],
//   flavour: "Nice Catch, Jerkules. \n–Village boy",
//   colors: ["ruby"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Antoine Couttolenc",
//   number: 108,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547702,
//   },
//   rarity: "common",
// };
//
