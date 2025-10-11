import type { GundamitoCommandCard } from "../../cardTypes";

export const card: GundamitoCommandCard = {
  id: "GD01-119",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 119,
  name: "Iron-Fisted Discipline",
  color: "white",
  set: "GD01",
  rarity: "rare",
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
          targetText: "enemy Unit that is Lv",
          originalText: "Choose 1 enemy Unit that is Lv.",
        },
      ],
      trigger: {
        event: "action",
      },
      text: "【action】",
    },
  ],
};
