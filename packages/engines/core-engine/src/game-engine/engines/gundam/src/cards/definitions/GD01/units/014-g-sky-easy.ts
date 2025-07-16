import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-014",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 14,
  name: "G-Sky Easy",
  color: "blue",
  set: "GD01",
  rarity: "common",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["(white base team) trait"],
  ap: 1,
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
          condition: "",
          targetText: "Unit",
          originalText: "Choose 1 Unit.",
        },
      ],
      trigger: {
        event: "once-per-turn",
      },
      text: "【once per turn】",
    },
  ],
};
