import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-110",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 110,
  name: "Rasid&#039;s Orders",
  color: "green",
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
          condition: "",
          targetText: "Unit that is Lv",
          originalText: "Choose 1 Unit that is Lv.",
        },
      ],
      trigger: {
        event: "action",
      },
      text: "【action】",
    },
  ],
};
