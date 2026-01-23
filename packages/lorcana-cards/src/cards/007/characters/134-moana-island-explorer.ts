import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaIslandExplorer: CharacterCard = {
  id: "1rb",
  cardType: "character",
  name: "Moana",
  version: "Island Explorer",
  fullName: "Moana - Island Explorer",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "007",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nADVENTUROUS SPIRIT Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 134,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e4393d614409dae5df4ecdd00e5bd3f488227461",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { anotherChosenCharOfYours } from "@lorcanito/lorcana-engine/abilities/target";
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { getStrengthThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const moanaIslandExplorer: LorcanitoCharacterCard = {
//   id: "fa3",
//   name: "Moana",
//   title: "Island Explorer",
//   characteristics: ["storyborn", "hero", "princess"],
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 4,
//   willpower: 3,
//   illustrator: "Jackie Droujko",
//   number: 134,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619480,
//   },
//   rarity: "uncommon",
//   lore: 1,
//   text: "Evasive\nADVENTUROUS SPIRIT Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.",
//   abilities: [
//     evasiveAbility,
//     wheneverChallengesAnotherChar({
//       name: "ADVENTUROUS SPIRIT",
//       text: "Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.",
//       effects: [getStrengthThisTurn(3, anotherChosenCharOfYours)],
//     }),
//   ],
// };
//
