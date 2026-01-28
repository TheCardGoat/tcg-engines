import type { CommandCardDefinition } from "@tcg/gundam-types";

export const SignsOfARevolution: CommandCardDefinition = {
  id: "gd01-104",
  name: "Signs of a Revolution",
  cardNumber: "GD01-104",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "common",
  color: "blue",
  level: 3,
  cost: 2,
  text: "【Burst】Draw 1.\n【Main】Choose 1 rested enemy Unit. Deal 2 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-104.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  timing: "MAIN",
  effects: [
    {
      id: "eff-b5q7jxbfm",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Draw 1.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "DRAW",
        value: 1,
      },
    },
    {
      id: "eff-8rlnv9418",
      type: "CONSTANT",
      description: "Choose 1 rested enemy Unit. Deal 2 damage to it.",
      restrictions: [],
      conditions: [],
      action: {
        type: "DAMAGE",
        value: 2,
        target: {
          controller: "OPPONENT",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [
            {
              type: "exerted",
            },
          ],
        },
      },
    },
  ],
};
