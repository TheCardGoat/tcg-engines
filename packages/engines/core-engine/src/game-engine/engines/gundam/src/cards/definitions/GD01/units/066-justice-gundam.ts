import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-066",
  implemented: false,
  missingTestCase: true,
  cost: 5,
  level: 7,
  number: 66,
  name: "Justice Gundam",
  color: "white",
  set: "GD01",
  rarity: "legendary",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["athrun zala"],
  ap: 5,
  hp: 5,
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Blocker",
        },
      ],
      text: "<Blocker>",
    },
    {
      type: "triggered",
      effects: [
        {
          type: "rule",
          ruleText: "(Triple Ship Alliance",
          originalText: "((Triple Ship Alliance)",
        },
      ],
      trigger: {
        event: "deploy",
      },
      text: "【deploy】",
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
          targetText: "of your (Triple Ship Alliance) Unit tokens",
          originalText: "Choose 1 of your (Triple Ship Alliance) Unit tokens.",
        },
        {
          type: "rule",
          ruleText: "Triple Ship Alliance",
          originalText: "(Triple Ship Alliance)",
        },
      ],
      trigger: {
        event: "attack",
      },
      text: "【attack】",
    },
  ],
};
