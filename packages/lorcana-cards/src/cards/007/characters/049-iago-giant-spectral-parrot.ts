import type { CharacterCard } from "@tcg/lorcana-types";

export const iagoGiantSpectralParrot: CharacterCard = {
  id: "145",
  cardType: "character",
  name: "Iago",
  version: "Giant Spectral Parrot",
  fullName: "Iago - Giant Spectral Parrot",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "007",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nVanish (When an opponent chooses this character for an action, banish them.)",
  cost: 4,
  strength: 4,
  willpower: 6,
  lore: 1,
  cardNumber: 49,
  inkable: true,
  externalIds: {
    ravensburger: "92a28806ab3fe41ff2c28195914ec78416311980",
  },
  abilities: [
    {
      id: "145-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "145-2",
      type: "keyword",
      keyword: "Vanish",
      text: "Vanish",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Illusion"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   evasiveAbility,
//   vanishAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const iagoGiantSpectralParrot: LorcanitoCharacterCard = {
//   id: "dfk",
//   name: "Iago",
//   title: "Giant Spectral Parrot",
//   characteristics: ["dreamborn", "ally", "illusion"],
//   text: "Evasive\nVanish",
//   type: "character",
//   abilities: [vanishAbility, evasiveAbility],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 4,
//   willpower: 6,
//   illustrator: "John Loren / Nicholas Kole",
//   number: 49,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618171,
//   },
//   rarity: "rare",
//   lore: 1,
// };
//
