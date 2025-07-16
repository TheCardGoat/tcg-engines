import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-007",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 3,
  number: 7,
  name: "Noin&#039;s Aries",
  color: "blue",
  set: "GD01",
  rarity: "rare",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["lucrezia noin"],
  ap: 2,
  hp: 3,
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "draw",
          amount: 1,
        },
        {
          type: "rule",
          ruleText: "OZ",
          originalText: "(OZ)",
        },
      ],
      trigger: {
        event: "destroyed",
      },
      text: "【destroyed】",
    },
  ],
};
