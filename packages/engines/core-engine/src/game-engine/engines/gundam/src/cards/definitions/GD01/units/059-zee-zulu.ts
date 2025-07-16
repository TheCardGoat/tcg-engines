import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-059",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 2,
  number: 59,
  name: "Zee Zulu",
  color: "red",
  set: "GD01",
  rarity: "common",
  type: "unit",
  zones: ["earth"],
  traits: ["zeon"],
  linkRequirement: ["-"],
  ap: 2,
  hp: 2,
  abilities: [
    {
      type: "triggered",
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
          amount: 2,
          duration: "turn",
          targetText: "If you are attacking the enemy player, this Unit",
          originalText:
            "If you are attacking the enemy player, this Unit gets AP+2",
        },
      ],
      trigger: {
        event: "attack",
      },
      text: "【attack】",
    },
  ],
};
