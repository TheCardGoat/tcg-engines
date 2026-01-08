import type { CharacterCard } from "@tcg/lorcana-types";

export const bronxFerociousBeast: CharacterCard = {
  id: "ews",
  cardType: "character",
  name: "Bronx",
  version: "Ferocious Beast",
  fullName: "Bronx - Ferocious Beast",
  inkType: ["ruby"],
  franchise: "Gargoyles",
  set: "010",
  text: "Reckless (This character can't quest and must challenge each turn if able.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  cost: 3,
  strength: 6,
  willpower: 4,
  lore: 0,
  cardNumber: 114,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "35bd1b5cebc36f804337eb70b555bf8033e5ada9",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Gargoyle"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { recklessAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { stoneByDayAbility } from "@lorcanito/lorcana-engine/cards/010/abilities/stoneByDay";
//
// export const bronxFerociousBeast: LorcanitoCharacterCard = {
//   id: "krn",
//   name: "Bronx",
//   title: "Ferocious Beast",
//   characteristics: ["storyborn", "ally", "gargoyle"],
//   text: "Reckless\n\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 6,
//   willpower: 4,
//   illustrator: "Michaela Martin / Livio Cacciatore",
//   number: 114,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658328,
//   },
//   rarity: "common",
//   abilities: [recklessAbility, stoneByDayAbility],
//   lore: 0,
// };
//
