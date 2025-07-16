import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-102",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 102,
  name: "Securing the Supply Line",
  color: "blue",
  set: "GD01",
  rarity: "uncommon",
  type: "command",
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "placeholder",
          parameters: {},
        },
      ],
      trigger: {
        event: "main",
      },
      text: "【Main】",
    },
  ],
};
