import type { CharacterCard } from "@tcg/lorcana-types";

export const thePhantomBlotShadowyFigure: CharacterCard = {
  id: "1wy",
  cardType: "character",
  name: "The Phantom Blot",
  version: "Shadowy Figure",
  fullName: "The Phantom Blot - Shadowy Figure",
  inkType: ["ruby"],
  set: "007",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  cardNumber: 135,
  inkable: false,
  externalIds: {
    ravensburger: "f87fff900b6d5596c88b04100c0a87c2c9346faa",
  },
  abilities: [
    {
      id: "1wy-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const thePhantomBlotShadowyFigure: LorcanitoCharacterCard = {
//   id: "f3g",
//   name: "The Phantom Blot",
//   title: "Shadowy Figure",
//   characteristics: ["storyborn", "villain"],
//   text: "Rush",
//   type: "character",
//   abilities: [rushAbility],
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 3,
//   willpower: 1,
//   illustrator: "Luca Pinelli",
//   number: 135,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619481,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
