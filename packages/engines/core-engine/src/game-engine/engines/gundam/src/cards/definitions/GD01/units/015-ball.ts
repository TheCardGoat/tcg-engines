import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-015",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 1,
  number: 15,
  name: "Ball",
  color: "blue",
  set: "GD01",
  rarity: "common",
  type: "unit",
  zones: ["space"],
  traits: ["earth federation"],
  linkRequirement: ["-"],
  ap: 1,
  hp: 1,
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
          targetText: "of your Units",
          originalText: "Choose 1 of your Units.",
        },
      ],
      trigger: {
        event: "attack",
      },
      text: "【attack】",
    },
  ],
};
