import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-092",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 92,
  name: "M&#039;Quve",
  color: "green",
  set: "GD01",
  rarity: "common",
  type: "pilot",
  traits: ["zeon"],
  apModifier: 1,
  hpModifier: 1,
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Breach",
          value: 1,
        },
      ],
      text: "<Breach 1>",
    },
    {
      type: "triggered",
      effects: [
        {
          type: "move-to-hand",
          target: {
            type: "unit",
            value: "self",
            filters: [
              {
                filter: "type",
                value: "unit",
              },
            ],
            zone: "battlefield",
          },
          targetText: "this card",
          originalText: "Add this card to your hand",
        },
        {
          type: "rule",
          ruleText: "Zeon",
          originalText: "(Zeon)",
        },
      ],
      trigger: {
        event: "burst",
      },
      text: "【burst】",
    },
  ],
};
