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
  abilities: [
    {
      description: "【Main】Deal 2 damage to all Units with <Blocker>.",
      effect: {
        type: "DAMAGE",
        amount: 2,
        target: {
          type: "unknown",
          rawText: "all Units with <Blocker>",
        },
      },
    },
  ],
};
