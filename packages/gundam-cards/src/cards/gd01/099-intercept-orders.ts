import type { CommandCardDefinition } from "@tcg/gundam-types";

export const InterceptOrders: CommandCardDefinition = {
  id: "gd01-099",
  name: "Intercept Orders",
  cardNumber: "GD01-099",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "rare",
  color: "blue",
  level: 4,
  cost: 2,
  text: "【Burst】Choose 1 enemy Unit with 5 or less HP. Rest it.\n【Main】/【Action】Choose 1 to 2 enemy Units with 3 or less HP. Rest them.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-099.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  timing: "MAIN",
  effects: [
    {
      id: "eff-5katwx918",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Choose 1 enemy Unit with 5 or less HP. Rest it.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "REST",
        target: {
          controller: "OPPONENT",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [
            {
              type: "hp",
              comparison: "lte",
              value: 5,
            },
          ],
        },
      },
    },
    {
      id: "eff-6t4ezdhnu",
      type: "CONSTANT",
      description: "Choose 1 to 2 enemy Units with 3 or less HP. Rest them.",
      restrictions: [],
      conditions: [],
      action: {
        type: "REST",
        target: {
          controller: "OPPONENT",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [
            {
              type: "hp",
              comparison: "lte",
              value: 3,
            },
          ],
        },
      },
    },
  ],
};
