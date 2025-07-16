import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-008",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 8,
  name: "Guntank",
  color: "blue",
  set: "GD01",
  rarity: "uncommon",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["-"],
  ap: 1,
  hp: 2,
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
