import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-071",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 71,
  name: "Gundam Pharact",
  color: "white",
  set: "GD01",
  rarity: "rare",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirement: ["(academy) trait"],
  ap: 3,
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
          type: "attribute-boost",
          target: {
            type: "unit",
            value: "self",
            filters: [],
          },
          attribute: "AP",
          amount: -2,
          duration: "turn",
          targetText: "It",
          originalText: "It gets AP-2",
        },
      ],
      trigger: {
        event: "attack",
      },
      text: "【attack】",
    },
  ],
};
