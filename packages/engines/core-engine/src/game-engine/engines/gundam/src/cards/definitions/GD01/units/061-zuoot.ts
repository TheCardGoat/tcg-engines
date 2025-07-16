import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-061",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 1,
  number: 61,
  name: "ZuOOT",
  color: "red",
  set: "GD01",
  rarity: "common",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["-"],
  ap: 0,
  hp: 2,
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Support",
          value: 1,
        },
      ],
      text: "<Support 1>",
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
