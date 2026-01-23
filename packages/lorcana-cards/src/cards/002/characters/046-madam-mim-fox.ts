import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimFox: CharacterCard = {
  id: "1ej",
  cardType: "character",
  name: "Madam Mim",
  version: "Fox",
  fullName: "Madam Mim - Fox",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "CHASING THE RABBIT When you play this character, banish her or return another chosen character of yours to your hand.\nRush (This character can challenge the turn they're played.)",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 46,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b632a76e8971d47d81626acf0505fdf0b9a173ba",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   madameMimAbility,
//   rushAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const madamMimFox: LorcanitoCharacterCard = {
//   id: "rds",
//
//   name: "Madam Mim",
//   title: "Fox",
//   characteristics: ["sorcerer", "storyborn", "villain"],
//   text: "**CHASING THE RABBIT** When you play this character, banish her or return another chosen character of yours to your hand.\n\n**Rush** _(This character can challenge the turn they're played.)_",
//   type: "character",
//   abilities: [
//     rushAbility,
//     {
//       ...madameMimAbility,
//       name: "Chasing the Rabbit",
//     },
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 4,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Alice Pisoni",
//   number: 46,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 521719,
//   },
//   rarity: "rare",
// };
//
