import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-121",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 121,
  name: "Midair Modifications",
  color: "white",
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
          type: "placeholder",
          parameters: {},
        },
      ],
      trigger: {
        event: "burst",
      },
      text: "【burst】",
    },
    {
      type: "triggered",
      effects: [
        {
          type: "targeting",
          amount: "1",
          target: {
            type: "unit",
            value: 1,
            filters: [
              {
                filter: "type",
                value: "unit",
              },
            ],
            zone: "battlefield",
            isMultiple: false,
          },
          condition: ".",
          targetText: "rested Unit",
          originalText: "Choose 1 rested Unit with .",
        },
      ],
      trigger: {
        event: "main",
      },
      text: "【main】",
    },
  ],
};
