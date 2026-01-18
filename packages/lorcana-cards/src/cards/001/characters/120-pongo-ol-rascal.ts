import type { CharacterCard } from "@tcg/lorcana-types";
import { evasive } from "../../ability-helpers";

export const pongoOlRascal: CharacterCard = {
  id: "37j",
  cardType: "character",
  name: "Pongo",
  version: "Ol' Rascal",
  fullName: "Pongo - Ol' Rascal",
  inkType: ["ruby"],
  franchise: "101 Dalmatians",
  set: "001",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 120,
  inkable: true,
  externalIds: {
    ravensburger: "0b91137c16607aa4f8e758e7b1ffc78257c42cd4",
  },
  abilities: [evasive("37j-1")],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const pongoOlRascal: LorcanitoCharacterCard = {
//   id: "apm",
//   name: "Pongo",
//   title: "Ol' Rascal",
//   characteristics: ["hero", "storyborn"],
//   text: "**Evasive** (_Only characters with Evasive can challenge this character._)",
//   type: "character",
//   abilities: [evasiveAbility],
//   flavour:
//     "At first I had no particular plan, just anything to attract attention. You know, stir things up a bit.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 2,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Brian Weisz",
//   number: 120,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 503321,
//   },
//   rarity: "common",
// };
//
