import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-065",
  implemented: false,
  missingTestCase: true,
  cost: 5,
  level: 7,
  number: 65,
  name: "Freedom Gundam",
  color: "white",
  set: "GD01",
  rarity: "legendary",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["kira yamato"],
  ap: 4,
  hp: 6,
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
          condition: "",
          targetText: "enemy Unit",
          originalText: "choose 1 enemy Unit.",
        },
      ],
      trigger: {
        event: "once-per-turn",
      },
      text: "【once per turn】",
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
