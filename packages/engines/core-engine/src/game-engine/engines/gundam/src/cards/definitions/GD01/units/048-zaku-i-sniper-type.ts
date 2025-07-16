import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-048",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 2,
  number: 48,
  name: "Zaku I Sniper Type",
  color: "red",
  set: "GD01",
  rarity: "rare",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["(zeon) trait"],
  ap: 0,
  hp: 1,
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
    {
      type: "triggered",
      effects: [
        {
          type: "move-to-hand",
          target: {
            type: "unit",
            value: "self",
            filters: [],
          },
          targetText: "it",
          originalText: "add it to your hand",
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
