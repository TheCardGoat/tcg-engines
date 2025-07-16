import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-118",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 118,
  name: "Overflowing Affection",
  color: "white",
  set: "GD01",
  rarity: "uncommon",
  type: "command",
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "draw",
          amount: 2,
        },
        {
          type: "discard",
          amount: 1,
          originalText: "discard 1.",
        },
      ],
      trigger: {
        event: "main",
      },
      text: "【main】",
    },
  ],
};
