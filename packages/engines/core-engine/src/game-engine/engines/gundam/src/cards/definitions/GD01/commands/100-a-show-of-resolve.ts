import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-100",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 100,
  name: "A Show of Resolve",
  color: "blue",
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
      ],
      trigger: {
        event: "main",
      },
      text: "【main】",
    },
  ],
};
