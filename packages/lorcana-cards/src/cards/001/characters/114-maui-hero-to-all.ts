import type { CharacterCard } from "@tcg/lorcana-types";

export const mauiHeroToAll: CharacterCard = {
  id: "1s6",
  cardType: "character",
  name: "Maui",
  version: "Hero to All",
  fullName: "Maui - Hero to All",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "001",
  text: "Rush (This character can challenge the turn they're played.)\nReckless (This character can't quest and must challenge each turn if able.)",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 0,
  cardNumber: 114,
  inkable: true,
  externalIds: {
    ravensburger: "e7461b5e5c9e2bd3760cbfd6a8b7995386f18c2e",
  },
  abilities: [
    {
      id: "1s6-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
    {
      id: "1s6-2",
      type: "keyword",
      keyword: "Reckless",
      text: "Reckless",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   recklessAbility,
//   rushAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mauiHeroToAll: LorcanitoCharacterCard = {
//   id: "tkz",
//   name: "Maui",
//   title: "Hero to All",
//   characteristics: ["hero", "storyborn", "deity"],
//   text: "**Rush** _(This character can challenge the turn they're played.)_\n\n**Reckless** _(This character can't quest and must challenge each turn if able.)_",
//   type: "character",
//   illustrator: "Pirel / Marco Giorgianni",
//   abilities: [rushAbility, recklessAbility],
//   flavour: "What I believe you were trying to say is 'Thank you.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 5,
//   strength: 6,
//   willpower: 5,
//   lore: 0,
//   number: 114,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508784,
//   },
//   rarity: "rare",
// };
//
