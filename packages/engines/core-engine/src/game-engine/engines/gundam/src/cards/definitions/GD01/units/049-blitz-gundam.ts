import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-049",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 49,
  name: "Blitz Gundam",
  color: "red",
  set: "GD01",
  rarity: "rare",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["nicol amarfi"],
  ap: 3,
  hp: 3,
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
          condition: "5 or more AP",
          targetText: "of your (ZAFT) Units",
          originalText: "Choose 1 of your (ZAFT) Units with 5 or more AP.",
        },
        {
          type: "rule",
          ruleText: "ZAFT",
          originalText: "(ZAFT)",
        },
      ],
      trigger: {
        event: "deploy",
      },
      text: "【deploy】",
    },
  ],
};
