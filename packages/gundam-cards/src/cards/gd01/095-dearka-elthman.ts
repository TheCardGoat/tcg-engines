import type { PilotCardDefinition } from "@tcg/gundam-types";

export const DearkaElthman: PilotCardDefinition = {
  id: "gd01-095",
  name: "Dearka Elthman",
  cardNumber: "GD01-095",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "common",
  color: "red",
  level: 3,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【When Linked】Discard 1. If you do, draw 1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-095.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  traits: ["zaft", "coordinator"],
  apModifier: 1,
  hpModifier: 1,
  abilities: [
    {
      trigger: "ON_BURST",
      description:
        "【Burst】 Add this card to your hand. 【When Linked】Discard 1. If you do, draw 1.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Add this card to your hand. 【When Linked】Discard 1. If you do, draw 1.",
      },
    },
  ],
};
