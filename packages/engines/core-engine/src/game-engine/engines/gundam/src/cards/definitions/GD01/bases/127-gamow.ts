import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-127",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 127,
  name: "Gamow",
  color: "red",
  set: "GD01",
  rarity: "uncommon",
  type: "base",
  zones: ["space"],
  traits: ["warship"],
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Breach",
          value: 3,
        },
      ],
      text: "<Breach 3>",
    },
    {
      type: "triggered",
      effects: [
        {
          type: "placeholder",
          parameters: {},
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
          type: "move-to-hand",
          target: {
            type: "unit",
            value: 1,
            filters: [
              {
                filter: "type",
                value: "unit",
              },
              {
                filter: "owner",
                value: "self",
              },
            ],
            zone: "battlefield",
            isMultiple: false,
          },
          targetText: "1 of your Shields",
          originalText: "Add 1 of your Shields to your hand",
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
          condition: "5 or more AP",
          targetText: "friendly (ZAFT) Unit",
          originalText: "Choose 1 friendly (ZAFT) Unit with 5 or more AP.",
        },
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
          targetText:
            "this Base：Choose 1 friendly (ZAFT) Unit with 5 or more AP.",
          originalText:
            "Rest this Base：Choose 1 friendly (ZAFT) Unit with 5 or more AP.",
        },
        {
          type: "rule",
          ruleText: "ZAFT",
          originalText: "(ZAFT)",
        },
      ],
      trigger: {
        event: "activate･action",
      },
      text: "【activate･action】",
    },
  ],
  ap: 0,
  hp: 5,
};
