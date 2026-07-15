import type { UnitCardDefinition } from "@tcg/gundam-types";

export const AngelosGearaZulu: UnitCardDefinition = {
  ap: 3,
  cardNumber: "ST03-002",
  cardType: "UNIT",
  color: "red",
  cost: 3,
  hp: 3,
  id: "st03-002",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-002.webp?26013001",
  keywords: [
    {
      keyword: "Support",
      value: 2,
    },
  ],
  level: 4,
  linkRequirements: ["angelo-sauper"],
  name: "Angelo's Geara Zulu",
  rarity: "common",
  setCode: "ST03",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  text: "【Activate･Main】<Support 2> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
  traits: ["neo", "zeon"],
  zones: ["space", "earth"],
};
