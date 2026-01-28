import type { CommandCardDefinition } from "@tcg/gundam-types";

export const ExtremeHatred: CommandCardDefinition = {
  id: "gd01-112",
  name: "Extreme Hatred",
  cardNumber: "GD01-112",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "rare",
  color: "red",
  level: 6,
  cost: 1,
  text: "【Main】Choose 2 of your active Units. Rest them. If you do, choose 1 enemy Unit. Deal 3 damage to it.\n【Pilot】[Loni Garvey]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-112.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  timing: "MAIN",
  pilotProperties: {
    name: "Loni Garvey",
    traits: ["zeon", "newtype"],
    apModifier: 1,
    hpModifier: 0,
  },
  effects: [
    {
      id: "eff-o7resqjhh",
      type: "CONSTANT",
      description:
        "Choose 2 of your active Units. Rest them. If you do, choose 1 enemy Unit. Deal 3 damage to it. 【Pilot】[Loni Garvey]",
      restrictions: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "REST",
            target: {
              controller: "SELF",
              cardType: "UNIT",
              count: {
                min: 2,
                max: 2,
              },
              filters: [
                {
                  type: "ready",
                },
              ],
            },
          },
          {
            type: "CONDITIONAL",
            conditions: [],
            trueAction: {
              type: "CUSTOM",
              text: "choose 1 enemy Unit",
            },
          },
          {
            type: "DAMAGE",
            value: 3,
            target: {
              controller: "SELF",
              cardType: "UNIT",
              count: {
                min: 2,
                max: 2,
              },
              filters: [
                {
                  type: "ready",
                },
              ],
            },
          },
          {
            type: "CUSTOM",
            text: "【Pilot】[Loni Garvey]",
          },
        ],
      },
    },
  ],
};
