import type { CharacterCard } from "@tcg/lorcana-types";

export const grandmotherFaSpiritedElder: CharacterCard = {
  id: "xw6",
  cardType: "character",
  name: "Grandmother Fa",
  version: "Spirited Elder",
  fullName: "Grandmother Fa - Spirited Elder",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "007",
  text: "I'VE GOT ALL THE LUCK WE'LL NEED Whenever this character quests, you may give chosen character of yours +2 {S} this turn.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  cardNumber: 121,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7a2836741ab1e3ba9615346ca322042052b83d1e",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { chosenCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const grandmotherFaSpiritedElder: LorcanitoCharacterCard = {
//   id: "urj",
//   name: "Grandmother Fa",
//   title: "Spirited Elder",
//   characteristics: ["storyborn", "ally"],
//   text: "I'VE GOT ALL THE LUCK WE'LL NEED Whenever this character quests, you may give chosen character of yours +2 {S} this turn.",
//   type: "character",
//   abilities: [
//     wheneverThisCharacterQuests({
//       name: "I'VE GOT ALL THE LUCK WE'LL NEED",
//       text: "Whenever this character quests, you may give chosen character of yours +2 {S} this turn.",
//       effects: [chosenCharacterGetsStrength(2)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 1,
//   willpower: 1,
//   illustrator: "Jovi Sales",
//   number: 121,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619472,
//   },
//   rarity: "common",
//   lore: 2,
// };
//
