import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-019",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 19,
  name: "Byarlant Custom",
  color: "blue",
  set: "GD01",
  rarity: "uncommon",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["-"],
  ap: 3,
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
