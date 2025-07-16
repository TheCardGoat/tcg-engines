import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-111",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 111,
  name: "Battle of Aces",
  color: "red",
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
          targetText: "damaged enemy Unit",
          originalText: "Choose 1 damaged enemy Unit.",
        },
        {
          type: "damage",
          target: {
            type: "unit",
            value: "opponent",
            filters: [],
          },
          amount: 3,
          preventable: true,
        },
        {
          type: "damage",
          target: {
            type: "unit",
            value: "opponent",
            filters: [],
          },
          amount: 3,
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
