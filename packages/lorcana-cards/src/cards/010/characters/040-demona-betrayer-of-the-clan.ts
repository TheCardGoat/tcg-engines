import type { CharacterCard } from "@tcg/lorcana-types";

export const demonaBetrayerOfTheClan: CharacterCard = {
  abilities: [
    {
      id: "t99-1",
      keyword: "Challenger",
      text: "Challenger +2",
      type: "keyword",
      value: 2,
    },
    {
      effect: {
        condition: {
          expression: "you have 3 or more cards in your hand",
          type: "if",
        },
        then: {
          restriction: "cant-ready",
          target: "SELF",
          type: "restriction",
        },
        type: "conditional",
      },
      id: "t99-2",
      text: "STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
      type: "action",
    },
  ],
  cardNumber: 40,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Gargoyle", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "6971bf7d5d11cb8ae5a1a8881714bef541415dd5",
  },
  franchise: "Gargoyles",
  fullName: "Demona - Betrayer of the Clan",
  id: "t99",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Demona",
  set: "010",
  strength: 4,
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)\nSTONE BY DAY If you have 3 or more cards in your hand, this character can't ready.",
  version: "Betrayer of the Clan",
  willpower: 6,
};
