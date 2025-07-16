import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-002",
  implemented: false,
  missingTestCase: true,
  cost: 6,
  level: 7,
  number: 2,
  name: "Unicorn Gundam (Destroy Mode)",
  color: "blue",
  set: "GD01",
  rarity: "legendary",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["civilian"],
  linkRequirement: ["banagher links"],
  ap: 5,
  hp: 4,
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
          targetText: "enemy Unit",
          originalText: "Choose 1 enemy Unit.",
        },
        {
          type: "rest",
          target: {
            type: "unit",
            value: "opponent",
            filters: [],
          },
          targetText: "it.",
          originalText: "Rest it.",
        },
      ],
      trigger: {
        event: "attack",
      },
      text: "【attack】",
    },
  ],
};
