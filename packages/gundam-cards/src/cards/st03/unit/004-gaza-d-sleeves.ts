import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GazaDSleeves: UnitCardDefinition = {
  ap: 2,
  cardNumber: "ST03-004",
  cardType: "UNIT",
  color: "red",
  cost: 2,
  hp: 1,
  id: "st03-004",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-004.webp?26013001",
  keywords: [
    {
      keyword: "Support",
      value: 2,
    },
  ],
  level: 2,
  linkRequirements: ["-"],
  name: "Gaza D (Sleeves)",
  rarity: "common",
  setCode: "ST03",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  text: "【Activate･Main】<Support 2> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)",
  traits: ["neo", "zeon"],
  zones: ["space", "earth"],
};
