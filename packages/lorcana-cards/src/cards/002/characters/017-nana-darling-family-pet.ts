import type { CharacterCard } from "@tcg/lorcana-types";

export const nanaDarlingFamilyPet: CharacterCard = {
  id: "1lf",
  cardType: "character",
  name: "Nana",
  version: "Darling Family Pet",
  fullName: "Nana - Darling Family Pet",
  inkType: ["amber"],
  franchise: "Peter Pan",
  set: "002",
  text: "NURSEMAID Whenever you play a Floodborn character, you may remove all damage from chosen character.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 17,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cef2ff4e8de30c0cd1260a4d2a648a00a36ae52a",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { wheneverYouPlayAFloodBorn } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const nanaDarlingFamilyPet: LorcanitoCharacterCard = {
//   id: "v76",
//   name: "Nana",
//   title: "Darling Family Pet",
//   characteristics: ["storyborn", "ally"],
//   text: "**NURSEMAID** Whenever you play a Floodborn character, you may remove all damage from chosen character.",
//   type: "character",
//   abilities: [
//     wheneverYouPlayAFloodBorn({
//       name: "Nursemaid",
//       text: "Whenever you play a Floodborn character, you may remove all damage from chosen character.",
//       optional: true,
//       effects: [
//         {
//           type: "heal",
//           amount: 99,
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour: "Children are a dog's best friend.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Filipe Laurentino",
//   number: 17,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527718,
//   },
//   rarity: "uncommon",
// };
//
