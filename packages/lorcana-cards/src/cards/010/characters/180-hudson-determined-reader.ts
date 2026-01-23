import type { CharacterCard } from "@tcg/lorcana-types";

export const hudsonDeterminedReader: CharacterCard = {
  id: "g6l",
  cardType: "character",
  name: "Hudson",
  version: "Determined Reader",
  fullName: "Hudson - Determined Reader",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "010",
  text: "FINDING ANSWERS When you play this character, you may draw a card, then choose and discard a card.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 180,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3a532ccc31353dbb6467164ade2c99d0e31aed29",
  },
  abilities: [],
  classifications: ["Storyborn", "Mentor", "Gargoyle"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { stoneByDayAbility } from "@lorcanito/lorcana-engine/cards/010/abilities/stoneByDay";
// import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const hudsonDeterminedReader: LorcanitoCharacterCard = {
//   id: "z4a",
//   name: "Hudson",
//   title: "Determined Reader",
//   characteristics: ["storyborn", "mentor", "gargoyle"],
//   text: "FINDING ANSWERS When you play this character, you may draw a card, then choose and discard a card.\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Leonardo Giammichele",
//   number: 180,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658746,
//   },
//   rarity: "common",
//   abilities: [
//     whenYouPlayThis({
//       name: "FINDING ANSWERS",
//       text: "When you play this character, you may draw a card, then choose and discard a card.",
//       ...youMayDrawThenChooseAndDiscard,
//     }),
//     stoneByDayAbility,
//   ],
//   lore: 1,
// };
//
