import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-055",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 55,
  name: "BuCUE",
  color: "red",
  set: "GD01",
  rarity: "uncommon",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["-"],
  ap: 2,
  hp: 3,
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Support",
          value: 2,
        },
      ],
      text: "<Support 2>",
    },
    {
      type: "triggered",
      effects: [
        {
          type: "rest",
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
          targetText: "this Unit.",
          originalText: "Rest this Unit.",
        },
      ],
      trigger: {
        event: "activate･main",
      },
      text: "【activate･main】",
    },
  ],
};
