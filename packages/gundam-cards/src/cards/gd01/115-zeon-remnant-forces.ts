import type { CommandCardDefinition } from "@tcg/gundam-types";

export const ZeonRemnantForces: CommandCardDefinition = {
  id: "gd01-115",
  name: "Zeon Remnant Forces",
  cardNumber: "GD01-115",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "uncommon",
  color: "red",
  level: 2,
  cost: 1,
  text: "【Main】/【Action】Choose 1 enemy Unit. Deal 1 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-115.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  timing: "MAIN",
  effects: [
    {
      id: "eff-4jbm8cweq",
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
      id: "eff-m52x4e19t",
      type: "CONSTANT",
      description: "Choose 1 enemy Unit. Deal 1 damage to it.",
      restrictions: [],
      conditions: [],
      action: {
        type: "DAMAGE",
        value: 1,
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
  ],
};
