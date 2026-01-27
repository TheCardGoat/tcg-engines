import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Zowort: UnitCardDefinition = {
  id: "st01-009",
  name: "Zowort",
  cardNumber: "ST01-009",
  setCode: "ST01",
  cardType: "UNIT",
  rarity: "common",
  color: "white",
  level: 2,
  cost: 2,
  text: "<Blocker> (Rest this Unit to change the attack target to it.)\nThis Unit can't choose the enemy player as its attack target.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST01-009.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  ap: 3,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirements: ["-"],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  effects: [
    {
      id: "st01-009-effect-1",
      description:
        "<Blocker> (Rest this Unit to change the attack target to it.) This Unit can't choose the enemy player as its attack target.",
      type: "CONSTANT",
      action: {
        type: "CUSTOM",
        text: "<Blocker> (Rest this Unit to change the attack target to it.) This Unit can't choose the enemy player as its attack target.",
      },
    },
  ],
};
