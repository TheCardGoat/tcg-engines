import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-113",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 113,
  name: "The Desert Tiger",
  color: "red",
  set: "GD01",
  rarity: "uncommon",
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
          condition: "",
          targetText: "friendly (ZAFT) Unit",
          originalText: "Choose 1 friendly (ZAFT) Unit.",
        },
        {
          type: "rule",
          ruleText: "ZAFT",
          originalText: "(ZAFT)",
        },
      ],
      trigger: {
        event: "action",
      },
      text: "【action】",
    },
  ],
};
