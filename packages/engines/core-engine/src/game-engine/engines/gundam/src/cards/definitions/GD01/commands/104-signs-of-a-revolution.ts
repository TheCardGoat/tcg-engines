import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-104",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 104,
  name: "Signs of a Revolution",
  color: "blue",
  set: "GD01",
  rarity: "common",
  type: "command",
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "draw",
          amount: 1,
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
          condition: "",
          targetText: "rested enemy Unit",
          originalText: "Choose 1 rested enemy Unit.",
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
        event: "main",
      },
      text: "【main】",
    },
  ],
};
