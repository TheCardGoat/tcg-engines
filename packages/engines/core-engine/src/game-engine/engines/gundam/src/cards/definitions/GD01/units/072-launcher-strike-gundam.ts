import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-072",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 72,
  name: "Launcher Strike Gundam",
  color: "white",
  set: "GD01",
  rarity: "uncommon",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["(earth alliance) trait"],
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
