import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-028",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 5,
  number: 28,
  name: "Gundam Sandrock",
  color: "green",
  set: "GD01",
  rarity: "rare",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["quatre raberba winner"],
  ap: 4,
  hp: 4,
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "rule",
          ruleText: "Maganac Corps",
          originalText: "(Maganac Corps)",
        },
      ],
      trigger: {
        event: "deploy",
      },
      text: "【deploy】",
    },
  ],
};
