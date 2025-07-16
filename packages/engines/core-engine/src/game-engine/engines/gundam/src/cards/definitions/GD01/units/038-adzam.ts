import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-038",
  implemented: false,
  missingTestCase: true,
  cost: 4,
  level: 5,
  number: 38,
  name: "Adzam",
  color: "green",
  set: "GD01",
  rarity: "uncommon",
  type: "unit",
  zones: ["earth"],
  traits: ["zeon"],
  linkRequirement: ["(zeon) trait"],
  ap: 2,
  hp: 5,
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "damage",
          target: {
            type: "unit",
            value: "all",
            filters: [
              {
                filter: "type",
                value: "unit",
              },
              {
                filter: "owner",
                value: "opponent",
              },
            ],
            zone: "battlefield",
            isMultiple: true,
          },
          amount: 1,
          preventable: true,
        },
        {
          type: "damage",
          target: {
            type: "unit",
            value: "all",
            filters: [
              {
                filter: "type",
                value: "unit",
              },
              {
                filter: "owner",
                value: "opponent",
              },
            ],
            zone: "battlefield",
            isMultiple: true,
          },
          amount: 1,
          preventable: true,
        },
      ],
      trigger: {
        event: "deploy",
      },
      text: "【deploy】",
    },
  ],
};
