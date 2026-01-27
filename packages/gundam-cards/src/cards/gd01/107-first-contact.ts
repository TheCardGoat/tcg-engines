import type { CommandCardDefinition } from "@tcg/gundam-types";

export const FirstContact: CommandCardDefinition = {
  id: "gd01-107",
  name: "First Contact",
  cardNumber: "GD01-107",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "uncommon",
  color: "green",
  level: 3,
  cost: 3,
  text: "【Burst】Place 1 EX Resource.\n【Main】Place 1 rested Resource.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-107.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  timing: "MAIN",
  abilities: [
    {
      trigger: "ON_BURST",
      description:
        "【Burst】 Place 1 EX Resource. 【Main】Place 1 rested Resource.",
      effect: {
        type: "UNKNOWN",
        rawText: "Place 1 EX Resource. 【Main】Place 1 rested Resource.",
      },
    },
  ],
};
