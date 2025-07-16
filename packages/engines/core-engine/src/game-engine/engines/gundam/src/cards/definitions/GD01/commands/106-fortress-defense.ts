import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-106",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 5,
  number: 106,
  name: "Fortress Defense",
  color: "green",
  set: "GD01",
  rarity: "rare",
  type: "command",
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "rule",
          ruleText: "(Zeon",
          originalText: "((Zeon)",
        },
      ],
      trigger: {
        event: "main",
      },
      text: "【main】",
    },
  ],
};
