import type { GundamitoUnitCard } from "../../cardTypes";

export const card: GundamitoUnitCard = {
  id: "GD01-009",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 9,
  name: "G-Fighter",
  color: "blue",
  set: "GD01",
  rarity: "uncommon",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["(white base team) trait"],
  ap: 3,
  hp: 2,
  abilities: [
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
          condition: "",
          targetText: "of your (white Base Team) Units",
          originalText: "Choose 1 of your (white Base Team) Units.",
        },
        {
          type: "rule",
          ruleText: "white Base Team",
          originalText: "(white Base Team)",
        },
      ],
      trigger: {
        event: "deploy",
      },
      text: "【deploy】",
    },
  ],
};
