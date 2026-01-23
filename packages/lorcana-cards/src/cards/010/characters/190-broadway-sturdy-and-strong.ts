import type { CharacterCard } from "@tcg/lorcana-types";

export const broadwaySturdyAndStrong: CharacterCard = {
  id: "1q2",
  cardType: "character",
  name: "Broadway",
  version: "Sturdy and Strong",
  fullName: "Broadway - Sturdy and Strong",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "010",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can’t ready.",
  cost: 5,
  strength: 4,
  willpower: 6,
  lore: 2,
  cardNumber: 190,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dfbca85fa031e2aaa758875ad5437f9df8aea6e1",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Gargoyle"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { stoneByDayAbility } from "@lorcanito/lorcana-engine/cards/010/abilities/stoneByDay";
//
// export const broadwaySturdyAndStrong: LorcanitoCharacterCard = {
//   id: "uo6",
//   name: "Broadway",
//   title: "Sturdy and Strong",
//   characteristics: ["storyborn", "ally", "gargoyle"],
//   text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.) STONE BY DAY If you have 3 or more cards in your hand, this character can’t ready.",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 5,
//   strength: 4,
//   willpower: 6,
//   illustrator: "Kuya Jaypi",
//   number: 190,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658294,
//   },
//   rarity: "uncommon",
//   abilities: [stoneByDayAbility, bodyguardAbility],
//   lore: 2,
// };
//
