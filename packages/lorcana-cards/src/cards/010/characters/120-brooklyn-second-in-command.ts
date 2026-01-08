import type { CharacterCard } from "@tcg/lorcana-types";

export const brooklynSecondInCommand: CharacterCard = {
  id: "nda",
  cardType: "character",
  name: "Brooklyn",
  version: "Second in Command",
  fullName: "Brooklyn - Second in Command",
  inkType: ["ruby"],
  franchise: "Gargoyles",
  set: "010",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 120,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "543925fbb545a12396337e7712d953e7dd0f5651",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Gargoyle"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { stoneByDayAbility } from "@lorcanito/lorcana-engine/cards/010/abilities/stoneByDay";
//
// export const brooklynSecondInCommand: LorcanitoCharacterCard = {
//   id: "wcy",
//   name: "Brooklyn",
//   title: "Second in Command",
//   characteristics: ["storyborn", "ally", "gargoyle"],
//   text: "Evasive (Only characters with Evasive can challenge this character.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 3,
//   willpower: 2,
//   illustrator: "Cam Kendell",
//   number: 120,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659241,
//   },
//   rarity: "common",
//   abilities: [evasiveAbility, stoneByDayAbility],
//   lore: 1,
// };
//
