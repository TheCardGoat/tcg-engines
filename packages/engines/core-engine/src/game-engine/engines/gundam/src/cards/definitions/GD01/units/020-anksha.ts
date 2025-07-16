import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-020",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 20,
  name: "Anksha",
  color: "blue",
  set: "GD01",
  rarity: "common",
  type: "unit",
  zones: ["earth"],
  traits: ["earth federation"],
  linkRequirement: ["-"],
  ap: 3,
  hp: 3,
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
        event: "deploy",
      },
      text: "【deploy】",
    },
  ],
};
