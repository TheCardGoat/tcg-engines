import type { CommandCardDefinition } from "@tcg/gundam-types";

export const StrategicArms: CommandCardDefinition = {
  id: "gd01-108",
  name: "Strategic Arms",
  cardNumber: "GD01-108",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "uncommon",
  color: "green",
  level: 6,
  cost: 6,
  text: "【Main】Deal 2 damage to all Units with <Blocker>.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-108.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  timing: "MAIN",
  effects: [
    {
      id: "gd01-108-effect-1",
      description: "【Main】Deal 2 damage to all Units with <Blocker>.",
      type: "CONSTANT",
      action: {
        type: "DAMAGE",
        parameters: {
          target: {
            type: "unknown",
            rawText: "all Units with <Blocker>",
          },
          amount: 2,
        },
      },
    },
  ],
};
