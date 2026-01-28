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
  effects: [
    {
      id: "eff-dwf948v3o",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Place 1 EX Resource.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "Place 1 EX Resource.",
      },
    },
    {
      id: "eff-4uefeqg9o",
      type: "CONSTANT",
      description: "Place 1 rested Resource.",
      restrictions: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "Place 1 rested Resource.",
      },
    },
  ],
};
