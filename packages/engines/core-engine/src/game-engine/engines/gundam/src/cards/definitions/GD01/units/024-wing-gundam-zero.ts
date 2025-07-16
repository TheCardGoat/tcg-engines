import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-024",
  implemented: false,
  missingTestCase: true,
  cost: 8,
  level: 8,
  number: 24,
  name: "Wing Gundam Zero",
  color: "green",
  set: "GD01",
  rarity: "legendary",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["heero yuy"],
  ap: 5,
  hp: 7,
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "damage",
          target: {
            type: "unit",
            value: "all",
            filters: [
              {
                filter: "type",
                value: "unit",
              },
            ],
            zone: "battlefield",
            isMultiple: true,
          },
          amount: 3,
          preventable: true,
        },
        {
          type: "damage",
          target: {
            type: "unit",
            value: "all",
            filters: [
              {
                filter: "type",
                value: "unit",
              },
            ],
            zone: "battlefield",
            isMultiple: true,
          },
          amount: 3,
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
