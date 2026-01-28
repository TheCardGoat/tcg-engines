import type { CommandCardDefinition } from "@tcg/gundam-types";

export const StealthStratagem: CommandCardDefinition = {
  id: "gd01-116",
  name: "Stealth Stratagem",
  cardNumber: "GD01-116",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "common",
  color: "red",
  level: 2,
  cost: 1,
  text: "【Main】/【Action】Choose 1 enemy Unit with 2 or less AP. Deal 2 damage to it.\n【Pilot】[Nicol Amarfi]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-116.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  timing: "MAIN",
  pilotProperties: {
    name: "Nicol Amarfi",
    traits: ["zaft", "coordinator"],
    apModifier: 0,
    hpModifier: 1,
  },
  effects: [
    {
      id: "eff-a3ae5cg2w",
      type: "CONSTANT",
      description:
        "Choose 1 enemy Unit with 2 or less AP. Deal 2 damage to it. 【Pilot】[Nicol Amarfi]",
      restrictions: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
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
                  type: "ap",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
          {
            type: "CUSTOM",
            text: "【Pilot】[Nicol Amarfi]",
          },
        ],
      },
    },
  ],
};
