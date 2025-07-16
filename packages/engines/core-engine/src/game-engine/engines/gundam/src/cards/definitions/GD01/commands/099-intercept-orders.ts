import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-099",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 99,
  name: "Intercept Orders",
  color: "blue",
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
          condition: "5 or less HP",
          targetText: "enemy Unit",
          originalText: "Choose 1 enemy Unit with 5 or less HP.",
        },
        {
          type: "rest",
          target: {
            type: "unit",
            value: "opponent",
            filters: [],
          },
          targetText: "it.",
          originalText: "Rest it.",
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
          condition: "3 or less HP",
          targetText: "to 2 enemy Units",
          originalText: "Choose 1 to 2 enemy Units with 3 or less HP.",
        },
        {
          type: "rest",
          target: {
            type: "unit",
            value: "opponent",
            filters: [],
          },
          targetText: "them.",
          originalText: "Rest them.",
        },
      ],
      trigger: {
        event: "action",
      },
      text: "【action】",
    },
  ],
};
