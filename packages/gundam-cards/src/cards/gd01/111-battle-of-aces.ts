import type { CommandCardDefinition } from "@tcg/gundam-types";

export const BattleOfAces: CommandCardDefinition = {
  id: "gd01-111",
  name: "Battle of Aces",
  cardNumber: "GD01-111",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "rare",
  color: "red",
  level: 3,
  cost: 2,
  text: "【Burst】Choose 1 enemy Unit. Deal 2 damage to it.\n【Main】/【Action】Choose 1 damaged enemy Unit. Deal 3 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-111.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  timing: "MAIN",
  effects: [
    {
      id: "eff-k6ga9q9v1",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Choose 1 enemy Unit. Deal 2 damage to it.",
      restrictions: [],
      costs: [],
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
          filters: [],
        },
      },
    },
    {
      id: "eff-hf4q6sobf",
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
      id: "eff-w35r17dzt",
      type: "CONSTANT",
      description: "Choose 1 damaged enemy Unit. Deal 3 damage to it.",
      restrictions: [],
      conditions: [],
      action: {
        type: "DAMAGE",
        value: 3,
        target: {
          controller: "OPPONENT",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [
            {
              type: "damaged",
            },
          ],
        },
      },
    },
  ],
};
