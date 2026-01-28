import type { CommandCardDefinition } from "@tcg/gundam-types";

export const OverflowingAffection: CommandCardDefinition = {
  id: "gd01-118",
  name: "Overflowing Affection",
  cardNumber: "GD01-118",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "uncommon",
  color: "white",
  level: 2,
  cost: 1,
  text: "【Main】Draw 2. Then, discard 1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-118.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  timing: "MAIN",
  effects: [
    {
      id: "eff-8vh3tau6s",
      type: "CONSTANT",
      description: "Draw 2. Then, discard 1.",
      restrictions: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "DRAW",
            value: 2,
          },
          {
            type: "CUSTOM",
            text: "Then, discard 1",
          },
        ],
      },
    },
  ],
};
