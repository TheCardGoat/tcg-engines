import type { CharacterCard } from "@tcg/lorcana-types";

export const thePrinceVigilantSuitor: CharacterCard = {
  id: "ot0",
  cardType: "character",
  name: "The Prince",
  version: "Vigilant Suitor",
  fullName: "The Prince - Vigilant Suitor",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "007",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 2,
  strength: 0,
  willpower: 5,
  lore: 1,
  cardNumber: 24,
  inkable: false,
  externalIds: {
    ravensburger: "5966f7b1df7bd6ef309aa7694d0a45d89624c970",
  },
  abilities: [
    {
      id: "ot0-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const thePrinceChallengerOfTheRise: LorcanitoCharacterCard = {
//   id: "yba",
//   name: "The Prince",
//   title: "Vigilant Suitor",
//   characteristics: ["storyborn", "hero", "prince"],
//   text: "Bodyguard ",
//   type: "character",
//   abilities: [bodyguardAbility],
//   inkwell: false,
//   colors: ["amber"],
//   cost: 2,
//   strength: 0,
//   willpower: 5,
//   illustrator: "João Moura",
//   number: 24,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619419,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
