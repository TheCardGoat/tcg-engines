import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-047",
  implemented: false,
  missingTestCase: true,
  cost: 7,
  level: 8,
  number: 47,
  name: "Shamblo",
  color: "red",
  set: "GD01",
  rarity: "rare",
  type: "unit",
  zones: ["earth"],
  traits: ["zeon"],
  linkRequirement: ["(newtype) trait / (cyber-newtype) trait"],
  ap: 6,
  hp: 5,
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
          originalText: "choose 1 enemy Unit.",
        },
        {
          type: "damage",
          target: {
            type: "unit",
            value: "opponent",
            filters: [],
          },
          amount: 3,
          preventable: true,
        },
        {
          type: "damage",
          target: {
            type: "unit",
            value: "opponent",
            filters: [],
          },
          amount: 3,
          preventable: true,
        },
      ],
      trigger: {
        event: "attack",
      },
      text: "【attack】",
    },
  ],
};
