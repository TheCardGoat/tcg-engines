import type { CharacterCard } from "@tcg/lorcana-types";

export const stabbingtonBrotherWithoutAPatch: CharacterCard = {
  id: "103",
  cardType: "character",
  name: "Stabbington Brother",
  version: "Without a Patch",
  fullName: "Stabbington Brother - Without a Patch",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "007",
  text: "Rush (This character can challenge the turn they're played.) GET 'EM! Your other characters named Stabbington Brother gain Rush.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 125,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "81f21ee6476f7c8c81ebff1d297c52457d8fc8e4",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   rushAbility,
//   yourCharactersNamedGain,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const stabbingtonBrotherWithoutAPatch: LorcanitoCharacterCard = {
//   id: "l12",
//   name: "Stabbington Brother",
//   title: "Without a Patch",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   illustrator: "Florencia Vazquez",
//   number: 125,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619474,
//   },
//   rarity: "common",
//   lore: 1,
//   text: "Rush\nGET 'EM! Your other characters named Stabbington Brother gain Rush.",
//   abilities: [
//     rushAbility,
//     yourCharactersNamedGain({
//       name: "Stabbington Brother",
//       ability: rushAbility,
//       excludeSelf: true,
//     }),
//   ],
// };
//
