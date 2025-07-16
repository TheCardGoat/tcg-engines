import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-108",
  implemented: false,
  missingTestCase: true,
  cost: 6,
  level: 6,
  number: 108,
  name: "Strategic Arms",
  color: "green",
  set: "GD01",
  rarity: "uncommon",
  type: "command",
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Blocker",
        },
      ],
      text: "<Blocker>",
    },
    {
      type: "triggered",
      effects: [
        {
          type: "damage",
          target: {
            type: "unit",
            value: "all",
            filters: [
              {
                filter: "type",
                value: "unit",
              },
            ],
            zone: "battlefield",
            isMultiple: true,
          },
          amount: 2,
          preventable: true,
        },
        {
          type: "damage",
          target: {
            type: "unit",
            value: "all",
            filters: [
              {
                filter: "type",
                value: "unit",
              },
            ],
            zone: "battlefield",
            isMultiple: true,
          },
          amount: 2,
          preventable: true,
        },
      ],
      trigger: {
        event: "main",
      },
      text: "【main】",
    },
  ],
};
