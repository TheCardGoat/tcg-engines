import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-027",
  implemented: false,
  missingTestCase: true,
  cost: 5,
  level: 7,
  number: 27,
  name: "Big Zam",
  color: "green",
  set: "GD01",
  rarity: "rare",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["dozle zabi"],
  ap: 5,
  hp: 6,
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Breach",
          value: 4,
        },
      ],
      text: "<Breach 4>",
    },
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
          amount: 4,
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
          amount: 4,
          preventable: true,
        },
        {
          type: "rule",
          ruleText: "Zeon",
          originalText: "(Zeon)",
        },
        {
          type: "rule",
          ruleText: "Neo Zeon",
          originalText: "(Neo Zeon)",
        },
      ],
      trigger: {
        event: "deploy",
      },
      text: "【deploy】",
    },
  ],
};
