import type { CommandCardDefinition } from "@tcg/gundam-types";

export const DeepDevotion: CommandCardDefinition = {
  id: "gd01-101",
  name: "Deep Devotion",
  cardNumber: "GD01-101",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "rare",
  color: "blue",
  level: 2,
  cost: 1,
  text: "【Main】/【Action】Choose 1 friendly Link Unit. It recovers 3 HP.\n【Pilot】[Lucrezia Noin]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-101.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  timing: "MAIN",
  pilotProperties: {
    name: "Lucrezia Noin",
    traits: ["oz"],
    apModifier: 1,
    hpModifier: 0,
  },
  effects: [
    {
      id: "eff-8mi7tr9q5",
      type: "CONSTANT",
      description:
        "Choose 1 friendly Link Unit. It recovers 3 HP. 【Pilot】[Lucrezia Noin]",
      restrictions: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "HEAL",
            amount: 3,
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
            text: "【Pilot】[Lucrezia Noin]",
          },
        ],
      },
    },
  ],
};
