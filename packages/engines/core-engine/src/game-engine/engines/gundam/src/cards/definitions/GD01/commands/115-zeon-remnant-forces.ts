import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-115",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 115,
  name: "Zeon Remnant Forces",
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
          targetText: "enemy Unit",
          originalText: "Choose 1 enemy Unit.",
        },
        {
          type: "damage",
          target: {
            type: "unit",
            value: "opponent",
            filters: [],
          },
          amount: 1,
          preventable: true,
        },
        {
          type: "damage",
          target: {
            type: "unit",
            value: "opponent",
            filters: [],
          },
          amount: 1,
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
