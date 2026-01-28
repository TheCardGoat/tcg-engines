import type { CommandCardDefinition } from "@tcg/gundam-types";

export const SiegePloy: CommandCardDefinition = {
  id: "st02-014",
  name: "Siege Ploy",
  cardNumber: "ST02-014",
  setCode: "ST02",
  cardType: "COMMAND",
  rarity: "common",
  color: "blue",
  level: 3,
  cost: 1,
  text: "【Burst】Activate this card's 【Main】.\n【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Rest it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST02-014.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  timing: "MAIN",
  effects: [
    {
      id: "eff-05wn5xw41",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Activate this card's",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "Activate this card's",
      },
    },
    {
      id: "eff-dq1z9a9ht",
      type: "CONSTANT",
      description: ".",
      restrictions: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: ".",
      },
    },
    {
      id: "eff-z4xqxyqy2",
      type: "CONSTANT",
      description: "/",
      restrictions: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "/",
      },
    },
    {
      id: "eff-91mdhvslq",
      type: "CONSTANT",
      description: "Choose 1 enemy Unit with 5 or less HP. Rest it.",
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
              value: 5,
            },
          ],
        },
      },
    },
  ],
};
