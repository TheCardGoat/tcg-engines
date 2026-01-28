import type { BaseCardDefinition_Structure } from "@tcg/gundam-types";

export const Rewloola: BaseCardDefinition_Structure = {
  id: "st03-015",
  name: "Rewloola",
  cardNumber: "ST03-015",
  setCode: "ST03",
  cardType: "BASE",
  rarity: "common",
  color: "red",
  level: 3,
  cost: 2,
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 5 or less AP. Deal 1 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-015.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: Number.NaN,
  hp: 5,
  zones: ["space"],
  traits: ["neo", "zeon", "warship"],
  effects: [
    {
      id: "eff-m8cln2429",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Deploy this card.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "DEPLOY",
      },
    },
    {
      id: "eff-q9dvr219h",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description:
        "Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 5 or less AP. Deal 1 damage to it.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "ADD_TO_HAND",
          },
          {
            type: "CUSTOM",
            text: "Then, choose 1 enemy Unit with 5 or less AP",
          },
          {
            type: "DAMAGE",
            value: 1,
          },
        ],
      },
    },
  ],
};
