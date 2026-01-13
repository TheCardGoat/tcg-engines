import type { CharacterCard } from "@tcg/lorcana-types";

export const mirabelMadrigalHopefulDreamer: CharacterCard = {
  id: "1c9",
  cardType: "character",
  name: "Mirabel Madrigal",
  version: "Hopeful Dreamer",
  fullName: "Mirabel Madrigal - Hopeful Dreamer",
  inkType: ["amber", "amethyst"],
  franchise: "Encanto",
  set: "007",
  text: "Evasive (Only characters with Evasive can challenge this character.) Singer 5 (This character counts as cost 5 to sing songs.)",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 13,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "adf0136e1ec25cf120f49b7a4e1d31f8560793a7",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Madrigal"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   evasiveAbility,
//   singerAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mirabelMadrigalHopefulDreamer: LorcanitoCharacterCard = {
//   id: "lfp",
//   name: "Mirabel Madrigal",
//   title: "Hopeful Dreamer",
//   characteristics: ["storyborn", "hero", "madrigal"],
//   text: "Evasive\nSinger 5",
//   type: "character",
//   abilities: [evasiveAbility, singerAbility(5)],
//   inkwell: true,
//
//   colors: ["amethyst", "amber"],
//   cost: 3,
//   strength: 1,
//   willpower: 3,
//   illustrator: "Xoni",
//   number: 13,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618323,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
