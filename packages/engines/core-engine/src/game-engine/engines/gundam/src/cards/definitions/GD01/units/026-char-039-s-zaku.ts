import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-026",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 26,
  name: "Char&#039;s Zaku Ⅱ",
  color: "green",
  set: "GD01",
  rarity: "rare",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["char aznable"],
  ap: 3,
  hp: 2,
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
        event: "destroyed",
      },
      text: "【destroyed】",
    },
  ],
};
