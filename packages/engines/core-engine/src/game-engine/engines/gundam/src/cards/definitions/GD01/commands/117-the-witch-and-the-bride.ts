import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-117",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 5,
  number: 117,
  name: "The Witch and the Bride",
  color: "white",
  set: "GD01",
  rarity: "rare",
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
          condition: "5 or less HP",
          targetText: "enemy Unit",
          originalText: "Choose 1 enemy Unit with 5 or less HP.",
        },
      ],
      trigger: {
        event: "action",
      },
      text: "【action】",
    },
  ],
};
