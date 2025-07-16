import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-116",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 116,
  name: "Stealth Stratagem",
  color: "red",
  set: "GD01",
  rarity: "common",
  type: "command",
  abilities: [
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
          condition: "2 or less AP",
          targetText: "enemy Unit",
          originalText: "Choose 1 enemy Unit with 2 or less AP.",
        },
        {
          type: "damage",
          target: {
            type: "unit",
            value: "opponent",
            filters: [],
          },
          amount: 2,
          preventable: true,
        },
        {
          type: "damage",
          target: {
            type: "unit",
            value: "opponent",
            filters: [],
          },
          amount: 2,
          preventable: true,
        },
      ],
      trigger: {
        event: "action",
      },
      text: "【action】",
    },
  ],
};
