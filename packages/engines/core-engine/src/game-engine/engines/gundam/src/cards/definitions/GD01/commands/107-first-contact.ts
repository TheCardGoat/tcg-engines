import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-107",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 3,
  number: 107,
  name: "First Contact",
  color: "green",
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
        event: "burst",
      },
      text: "【burst】",
    },
  ],
};
