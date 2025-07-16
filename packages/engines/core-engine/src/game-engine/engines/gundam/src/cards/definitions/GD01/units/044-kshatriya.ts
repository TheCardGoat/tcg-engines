import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-044",
  implemented: false,
  missingTestCase: true,
  cost: 4,
  level: 5,
  number: 44,
  name: "Kshatriya",
  color: "red",
  set: "GD01",
  rarity: "legendary",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["marida cruz"],
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
          targetText: "to 2 enemy Units",
          originalText: "Choose 1 to 2 enemy Units.",
        },
        {
          type: "damage",
          target: {
            type: "unit",
            value: "opponent",
            filters: [],
          },
          amount: 1,
          preventable: true,
        },
        {
          type: "damage",
          target: {
            type: "unit",
            value: "opponent",
            filters: [],
          },
          amount: 1,
          preventable: true,
        },
      ],
      trigger: {
        event: "when-paired･(cyber-newtype)/(newtype)-pilot",
      },
      text: "【when paired･(cyber-newtype)/(newtype) pilot】",
    },
  ],
};
