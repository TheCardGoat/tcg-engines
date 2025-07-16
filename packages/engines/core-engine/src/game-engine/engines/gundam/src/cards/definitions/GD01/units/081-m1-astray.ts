import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-081",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 2,
  number: 81,
  name: "M1 Astray",
  color: "white",
  set: "GD01",
  rarity: "common",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["-"],
  ap: 2,
  hp: 2,
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
          type: "attribute-boost",
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
          attribute: "AP",
          amount: 1,
          duration: "turn",
          targetText:
            "While you have another (Triple Ship Alliance) Unit in play, this Unit",
          originalText:
            "While you have another (Triple Ship Alliance) Unit in play, this Unit gets AP+1",
        },
        {
          type: "rule",
          ruleText: "Triple Ship Alliance",
          originalText: "(Triple Ship Alliance)",
        },
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
      text: "While you have another (Triple Ship Alliance) Unit in play, this Unit gets AP+1 and . (Rest this Unit to change the attack target to it.",
      dependentEffects: true,
      resolveEffectsIndividually: true,
    },
  ],
};
