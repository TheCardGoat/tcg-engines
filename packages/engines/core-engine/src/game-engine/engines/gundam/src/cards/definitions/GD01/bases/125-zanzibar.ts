import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-125",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 125,
  name: "Zanzibar",
  color: "green",
  set: "GD01",
  rarity: "uncommon",
  type: "base",
  zones: ["space", "earth"],
  traits: ["zeon", "warship"],
  abilities: [
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
        {
          type: "rule",
          ruleText: "Zeon",
          originalText: "(Zeon)",
        },
      ],
      trigger: {
        event: "deploy",
      },
      text: "【deploy】",
    },
  ],
  ap: 0,
  hp: 5,
};
