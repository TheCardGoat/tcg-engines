import type { CommandCardDefinition } from "@tcg/gundam-types";

export const TheDesertTiger: CommandCardDefinition = {
  id: "gd01-113",
  name: "The Desert Tiger",
  cardNumber: "GD01-113",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "uncommon",
  color: "red",
  level: 3,
  cost: 1,
  text: "【Main】/【Action】Choose 1 friendly (ZAFT) Unit. It gets AP+3 during this turn.\n【Pilot】[Andrew Waldfeld]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-113.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  timing: "MAIN",
  pilotProperties: {
    name: "Andrew Waldfeld",
    traits: ["zaft", "coordinator"],
    apModifier: 1,
    hpModifier: 0,
  },
  effects: [
    {
      id: "eff-p3g2qf6aj",
      type: "CONSTANT",
      description:
        "Choose 1 friendly (ZAFT) Unit. It gets AP+3 during this turn. 【Pilot】[Andrew Waldfeld]",
      restrictions: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "MODIFY_STATS",
            attribute: "AP",
            value: 3,
            duration: "TURN",
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
          {
            type: "CUSTOM",
            text: "【Pilot】[Andrew Waldfeld]",
          },
        ],
      },
    },
  ],
};
