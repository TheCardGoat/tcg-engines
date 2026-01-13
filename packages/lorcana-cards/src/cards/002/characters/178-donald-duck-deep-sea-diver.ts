import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckDeepseaDiver: CharacterCard = {
  id: "cib",
  cardType: "character",
  name: "Donald Duck",
  version: "Deep-Sea Diver",
  fullName: "Donald Duck - Deep-Sea Diver",
  inkType: ["steel"],
  set: "002",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 1,
  cardNumber: 178,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "2d1523613bbd50b23b61babdbc277756f44919ac",
  },
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const donaldDuckDeepSeaDiver: LorcanitoCharacterCard = {
//   id: "hoc",
//
//   name: "Donald Duck",
//   title: "Deep-Sea Diver",
//   characteristics: ["hero", "dreamborn"],
//   type: "character",
//   flavour:
//     "You go ahead, Minnie! I'm going to see if there's any lore over here.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 5,
//   strength: 6,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Nicholas Kole",
//   number: 178,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 524218,
//   },
//   rarity: "common",
// };
//
