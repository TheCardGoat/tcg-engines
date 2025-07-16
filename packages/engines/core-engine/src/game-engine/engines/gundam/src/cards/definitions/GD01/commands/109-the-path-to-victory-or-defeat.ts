import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-109",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 5,
  number: 109,
  name: "The Path to Victory or Defeat",
  color: "green",
  set: "GD01",
  rarity: "common",
  type: "command",
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "search",
          target: {
            type: "zone",
            value: "deck",
            filters: [],
          },
          amount: 1,
          searchType: "look",
        },
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
          ruleText: "Operation Meteor",
          originalText: "(Operation Meteor)",
        },
        {
          type: "rule",
          ruleText: "G Team",
          originalText: "(G Team)",
        },
      ],
      trigger: {
        event: "main",
      },
      text: "【main】",
    },
  ],
};
