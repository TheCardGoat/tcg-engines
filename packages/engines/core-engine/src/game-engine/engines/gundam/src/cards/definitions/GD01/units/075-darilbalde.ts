import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-075",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 75,
  name: "Darilbalde",
  color: "white",
  set: "GD01",
  rarity: "uncommon",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirement: ["(academy) trait"],
  ap: 4,
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
  ],
};
