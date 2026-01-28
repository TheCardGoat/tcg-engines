import type { CommandCardDefinition } from "@tcg/gundam-types";

export const CovertOperative: CommandCardDefinition = {
  id: "gd01-122",
  name: "Covert Operative",
  cardNumber: "GD01-122",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "common",
  color: "white",
  level: 3,
  cost: 1,
  text: "【Main】Choose 1 enemy Unit with 2 or less HP. Return it to its owner&#039;s hand. If you have a Link Unit in play, choose 1 enemy Unit with 4 or less HP instead.\n【Pilot】[Shaddiq Zenelli]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-122.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  timing: "MAIN",
  pilotProperties: {
    name: "Shaddiq Zenelli",
    traits: ["academy"],
    apModifier: 1,
    hpModifier: 0,
  },
  effects: [
    {
      id: "eff-8rzsac3zd",
      type: "CONSTANT",
      description:
        "Choose 1 enemy Unit with 2 or less HP. Return it to its owner&#039;s hand. If you have a Link Unit in play, choose 1 enemy Unit with 4 or less HP instead. 【Pilot】[Shaddiq Zenelli]",
      restrictions: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "ADD_TO_HAND",
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
                  value: 2,
                },
              ],
            },
          },
          {
            type: "CONDITIONAL",
            conditions: [
              {
                type: "STATE_CHECK",
                text: "you have a Link Unit in play",
              },
            ],
            trueAction: {
              type: "CUSTOM",
              text: "choose 1 enemy Unit with 4 or less HP instead",
            },
          },
          {
            type: "CUSTOM",
            text: "【Pilot】[Shaddiq Zenelli]",
          },
        ],
      },
    },
  ],
};
