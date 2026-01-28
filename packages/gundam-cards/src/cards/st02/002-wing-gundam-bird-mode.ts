import type { UnitCardDefinition } from "@tcg/gundam-types";

export const WingGundamBirdMode: UnitCardDefinition = {
  id: "st02-002",
  name: "Wing Gundam (Bird Mode)",
  cardNumber: "ST02-002",
  setCode: "ST02",
  cardType: "UNIT",
  rarity: "common",
  color: "green",
  level: 3,
  cost: 3,
  text: "【Deploy】Place 1 EX Resource.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST02-002.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 2,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["operation", "meteor"],
  linkRequirements: ["heero-yuy"],
  effects: [
    {
      id: "eff-9c1xajwi3",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description: "Place 1 EX Resource.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "Place 1 EX Resource.",
      },
    },
  ],
};
