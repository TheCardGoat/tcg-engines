import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-114",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 1,
  number: 114,
  name: "Assault on Torrington Base",
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
          amount: "2",
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
          condition: "",
          targetText: "friendly Units",
          originalText: "Choose 2 friendly Units.",
        },
      ],
      trigger: {
        event: "action",
      },
      text: "【action】",
    },
  ],
};
