import type { CharacterCard } from "@tcg/lorcana-types";

export const demonaBetrayerOfTheClan: CharacterCard = {
  id: "t99",
  cardType: "character",
  name: "Demona",
  version: "Betrayer of the Clan",
  fullName: "Demona - Betrayer of the Clan",
  inkType: ["amethyst"],
  franchise: "Gargoyles",
  set: "010",
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  cost: 4,
  strength: 4,
  willpower: 6,
  lore: 1,
  cardNumber: 40,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6971bf7d5d11cb8ae5a1a8881714bef541415dd5",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Gargoyle", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { challengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { stoneByDayAbility } from "@lorcanito/lorcana-engine/cards/010/abilities/stoneByDay";
//
// export const demonaBetrayerOfTheClan: LorcanitoCharacterCard = {
//   id: "lza",
//   name: "Demona",
//   title: "Betrayer of the Clan",
//   characteristics: ["storyborn", "villain", "gargoyle", "sorcerer"],
//   text: "Challenger +2 (While challenging, this character gets +2 {S}.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 4,
//   willpower: 6,
//   illustrator: "Alice Pisoni",
//   number: 40,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658503,
//   },
//   rarity: "common",
//   abilities: [challengerAbility(2), stoneByDayAbility],
//   lore: 1,
// };
//
