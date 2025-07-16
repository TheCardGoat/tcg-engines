import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-046",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 46,
  name: "Buster Gundam",
  color: "red",
  set: "GD01",
  rarity: "legendary",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["dearka elthman"],
  ap: 1,
  hp: 4,
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Support",
          value: 3,
        },
      ],
      text: "<Support 3>",
    },
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Support",
        },
      ],
      text: "<Support>",
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
          type: "rule",
          ruleText: "ZAFT",
          originalText: "(ZAFT)",
        },
      ],
      trigger: {
        event: "once-per-turn",
      },
      text: "【once per turn】",
    },
  ],
};
