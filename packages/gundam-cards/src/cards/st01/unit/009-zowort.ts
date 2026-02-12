import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Zowort: UnitCardDefinition = {
  ap: 3,
  cardNumber: "ST01-009",
  cardType: "UNIT",
  color: "white",
  cost: 2,
  hp: 2,
  id: "st01-009",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-009.webp?26013001",
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  level: 2,
  linkRequirements: ["-"],
  name: "Zowort",
  rarity: "common",
  setCode: "ST01",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  text: "<Blocker> (Rest this Unit to change the attack target to it.)\nThis Unit can't choose the enemy player as its attack target.",
  traits: ["academy"],
  zones: ["space", "earth"],
};
