import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckBoisterousFowl: CharacterCard = {
  id: "ok1",
  cardType: "character",
  name: "Donald Duck",
  version: "Boisterous Fowl",
  fullName: "Donald Duck - Boisterous Fowl",
  inkType: ["ruby"],
  set: "001",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 108,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "5880e4814c3c2fb5e6a2d48ca24bf6960f564337",
  },
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const donaldDuck: LorcanitoCharacterCard = {
//   id: "ni4",
//   name: "Donald Duck",
//   title: "Boisterous Fowl",
//   characteristics: ["storyborn"],
//   type: "character",
//   flavour: "„Who you callin' boisterous, buster?",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Kenneth Anderson",
//   number: 108,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493487,
//   },
//   rarity: "uncommon",
// };
//
