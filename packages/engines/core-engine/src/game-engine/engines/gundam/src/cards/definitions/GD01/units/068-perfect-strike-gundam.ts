import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-068",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 5,
  number: 68,
  name: "Perfect Strike Gundam",
  color: "white",
  set: "GD01",
  rarity: "rare",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["(earth alliance) trait"],
  ap: 4,
  hp: 4,
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Blocker",
        },
      ],
      text: "<Blocker>",
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
          condition: "1 HP",
          targetText: "enemy Unit",
          originalText: "Choose 1 enemy Unit with 1 HP.",
        },
      ],
      trigger: {
        event: "deploy",
      },
      text: "【deploy】",
    },
    {
      type: "resolution",
      effects: [
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
          targetText: "this Unit to change the attack target to it.",
          originalText: "Rest this Unit to change the attack target to it.",
        },
      ],
      text: "(Rest this Unit to change the attack target to it.",
      dependentEffects: false,
      resolveEffectsIndividually: false,
    },
  ],
};
