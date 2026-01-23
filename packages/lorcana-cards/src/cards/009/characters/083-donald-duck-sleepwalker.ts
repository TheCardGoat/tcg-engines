import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckSleepwalker: CharacterCard = {
  id: "1nl",
  cardType: "character",
  name: "Donald Duck",
  version: "Sleepwalker",
  fullName: "Donald Duck - Sleepwalker",
  inkType: ["emerald"],
  set: "009",
  text: "STARTLED AWAKE Whenever you play an action, this character gets +2 {S} this turn.",
  cost: 3,
  strength: 0,
  willpower: 5,
  lore: 1,
  cardNumber: 83,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d6d3d90026710636cf01bb4bba63c880361772bc",
  },
  abilities: [],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { donaldDuckSleepwalker as donaldDuckSleepwalkerAsOrig } from "@lorcanito/lorcana-engine/cards/002/characters/078-donald-duck-sleepwalker";
//
// export const donaldDuckSleepwalker: LorcanitoCharacterCard = {
//   ...donaldDuckSleepwalkerAsOrig,
//   id: "w9x",
//   reprints: [donaldDuckSleepwalkerAsOrig.id],
//   number: 83,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650023,
//   },
// };
//
