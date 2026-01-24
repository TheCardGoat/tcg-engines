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
  missingTests: true,
  externalIds: {
    ravensburger: "6971bf7d5d11cb8ae5a1a8881714bef541415dd5",
  },
  abilities: [
    {
      id: "t99-1",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
      text: "Challenger +2",
    },
    {
      id: "t99-2",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have 3 or more cards in your hand",
        },
        then: {
          type: "restriction",
          restriction: "cant-ready",
          target: "SELF",
        },
      },
      text: "STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Gargoyle", "Sorcerer"],
};
