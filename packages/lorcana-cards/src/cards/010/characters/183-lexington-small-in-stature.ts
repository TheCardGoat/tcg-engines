import type { CharacterCard } from "@tcg/lorcana-types";

export const lexingtonSmallInStature: CharacterCard = {
  id: "wbg",
  cardType: "character",
  name: "Lexington",
  version: "Small in Stature",
  fullName: "Lexington - Small in Stature",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "010",
  text: "Alert (This character can challenge as if they had Evasive.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 183,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "747a1bda0a4acde5dc18cc41597751d4687ea225",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Gargoyle"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { alertAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { stoneByDayAbility } from "@lorcanito/lorcana-engine/cards/010/abilities/stoneByDay";
//
// export const lexingtonSmallInStature: LorcanitoCharacterCard = {
//   id: "fis",
//   name: "Lexington",
//   title: "Small in Stature",
//   characteristics: ["storyborn", "ally", "gargoyle"],
//   text: "Alert (This character can challenge as if they had Evasive.) STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 4,
//   willpower: 4,
//   illustrator: "Leonardo Giammichele",
//   number: 183,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658745,
//   },
//   rarity: "uncommon",
//   abilities: [alertAbility, stoneByDayAbility],
//   lore: 1,
// };
//
