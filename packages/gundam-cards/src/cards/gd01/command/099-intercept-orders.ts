import type { CommandCardDefinition } from "@tcg/gundam-types";

export const InterceptOrders: CommandCardDefinition = {
  cardNumber: "GD01-099",
  cardType: "COMMAND",
  color: "blue",
  cost: 2,
  effects: [
    {
      action: {
        target: {
          cardType: "UNIT",
          controller: "OPPONENT",
          count: { max: 1, min: 1 },
          filters: [{ comparison: "lte", type: "hp", value: 5 }],
        },
        type: "REST",
      },
      conditions: [],
      costs: [],
      description: "【Burst】Choose 1 enemy Unit with 5 or less HP. Rest it.",
      id: "gd01-099-burst-1",
      restrictions: [],
      timing: "BURST",
      type: "TRIGGERED",
    },
    {
      action: {
        target: {
          cardType: "UNIT",
          controller: "OPPONENT",
          count: { max: 2, min: 1 },
          filters: [{ comparison: "lte", type: "hp", value: 3 }],
        },
        type: "REST",
      },
      conditions: [],
      description: "【Main】/【Action】Choose 1 to 2 enemy Units with 3 or less HP. Rest them.",
      id: "gd01-099-main-action-1",
      restrictions: [],
      type: "CONSTANT",
    },
  ],
  id: "gd01-099",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-099.webp?26013001",
  keywords: [],
  level: 4,
  name: "Intercept Orders",
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam",
  text: "【Burst】Choose 1 enemy Unit with 5 or less HP. Rest it.\n【Main】/【Action】Choose 1 to 2 enemy Units with 3 or less HP. Rest them.",
  timing: "MAIN",
};
