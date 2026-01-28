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
  effects: [
    {
      id: "eff-8y0f5i2wr",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Add this card to your hand.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "ADD_TO_HAND",
      },
    },
    {
      id: "eff-m9hlgyzlf",
      type: "TRIGGERED",
      timing: "WHEN_LINKED",
      description: "Discard 1. If you do, draw 1.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "DISCARD",
        value: 1,
      },
    },
  ],
};
