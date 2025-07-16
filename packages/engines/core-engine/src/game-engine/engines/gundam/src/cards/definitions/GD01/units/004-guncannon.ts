import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-004",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 4,
  name: "Guncannon",
  color: "blue",
  set: "GD01",
  rarity: "rare",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["(white base team) trait"],
  ap: 2,
  hp: 3,
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Repair",
          value: 1,
        },
      ],
      text: "<Repair 1>",
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
          condition: "2 or less HP",
          targetText: "enemy Unit",
          originalText: "Choose 1 enemy Unit with 2 or less HP.",
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
        event: "when-paired",
      },
      text: "【when paired】",
    },
  ],
};
