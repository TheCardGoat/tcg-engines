import type { BaseCardDefinition_Structure } from "@tcg/gundam-types";

export const Side7: BaseCardDefinition_Structure = {
  id: "gd01-124",
  name: "Side 7",
  cardNumber: "GD01-124",
  setCode: "GD01",
  cardType: "BASE",
  rarity: "common",
  color: "blue",
  level: 1,
  cost: 1,
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Activate･Main】Rest this Base：Choose 1 friendly Unit. It recovers 1 HP.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-124.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: Number.NaN,
  hp: 4,
  zones: ["space"],
  traits: ["earth", "federation", "stronghold"],
  effects: [
    {
      id: "eff-rmxq863uk",
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
      id: "eff-gikt7x6ad",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description: "Add 1 of your Shields to your hand.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "ADD_TO_HAND",
      },
    },
    {
      id: "eff-6qlpwajrg",
      type: "ACTIVATED",
      timing: "MAIN",
      description: "Rest this Base:Choose 1 friendly Unit. It recovers 1 HP.",
      restrictions: [],
      costs: [
        {
          type: "REST_SELF",
          amount: 1,
        },
      ],
      conditions: [],
      action: {
        type: "HEAL",
        amount: 1,
        target: {
          controller: "SELF",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [],
        },
      },
    },
  ],
};
