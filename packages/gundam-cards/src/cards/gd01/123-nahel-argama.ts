import type { BaseCardDefinition_Structure } from "@tcg/gundam-types";

export const NahelArgama: BaseCardDefinition_Structure = {
  id: "gd01-123",
  name: "Nahel Argama",
  cardNumber: "GD01-123",
  setCode: "GD01",
  cardType: "BASE",
  rarity: "uncommon",
  color: "blue",
  level: 3,
  cost: 2,
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 3 or less HP. Rest it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-123.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: Number.NaN,
  hp: 5,
  zones: ["space", "earth"],
  traits: ["earth", "federation", "warship"],
  effects: [
    {
      id: "eff-cnbao9bmw",
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
      id: "eff-3ybgoadai",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description:
        "Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 3 or less HP. Rest it.",
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
            text: "Then, choose 1 enemy Unit with 3 or less HP",
          },
          {
            type: "REST",
          },
        ],
      },
    },
  ],
};
