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
      id: "gd01-124-effect-1",
      description: "【Burst】 Deploy this card.",
      type: "TRIGGERED",
      timing: "BURST",
      action: {
        type: "CUSTOM",
        text: "Deploy this card.",
      },
    },
    {
      id: "gd01-124-effect-2",
      description: "【Deploy】 Add 1 of your Shields to your hand.",
      type: "TRIGGERED",
      timing: "DEPLOY",
      action: {
        type: "CUSTOM",
        text: "Add 1 of your Shields to your hand.",
      },
    },
    {
      id: "gd01-124-effect-3",
      description:
        "【Activate･Main】 Rest this Base：Choose 1 friendly Unit. It recovers 1 HP.",
      type: "ACTIVATED",
      timing: "MAIN",
      action: {
        type: "HEAL",
        parameters: {
          target: {
            type: "self",
          },
          amount: 1,
        },
      },
    },
  ],
};
