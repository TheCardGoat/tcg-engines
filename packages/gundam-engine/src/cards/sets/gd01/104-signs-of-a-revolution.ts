import type { CommandCardDefinition } from "../../card-types";

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
  abilities: [
    {
      trigger: "ON_BURST",
      description:
        "【Burst】 Draw 1. 【Main】Choose 1 rested enemy Unit. Deal 2 damage to it.",
      effect: {
        type: "DAMAGE",
        amount: 2,
        target: {
          type: "unknown",
          rawText: "it",
        },
      },
    },
  ],
};
