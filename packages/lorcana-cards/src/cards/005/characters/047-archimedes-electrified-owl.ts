import type { CharacterCard } from "@tcg/lorcana-types";

export const archimedesElectrifiedOwl: CharacterCard = {
  id: "oah",
  cardType: "character",
  name: "Archimedes",
  version: "Electrified Owl",
  fullName: "Archimedes - Electrified Owl",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Archimedes.)\nEvasive (Only characters with Evasive can challenge this character.)\nChallenger +3 (While challenging, this character gets +3 {S}.)",
  cost: 5,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 47,
  inkable: true,
  externalIds: {
    ravensburger: "578bdd170d24c10c27b0de9d21eb62b130201c69",
  },
  abilities: [
    {
      id: "oah-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "oah-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "oah-3",
      type: "keyword",
      keyword: "Challenger",
      value: 3,
      text: "Challenger +3",
    },
  ],
  classifications: ["Floodborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   challengerAbility,
//   evasiveAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const archimedesElectrifiedOwl: LorcanitoCharacterCard = {
//   id: "p40",
//   name: "Archimedes",
//   title: "Electrified Owl",
//   characteristics: ["floodborn", "ally"],
//   text: "**Shift** 3 _You may pay 3 {I} to play this on top of one of your characters named Archimedes.)_\n \n**Evasive** _(Only characters with Evasive can challenge this character._\n \n**Challenger** +3 _(While challenging, this character gets +3 {S}.)_",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "Archimedes"),
//     evasiveAbility,
//     challengerAbility(3),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 1,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Michaela Martin",
//   number: 47,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561193,
//   },
//   rarity: "uncommon",
// };
//
