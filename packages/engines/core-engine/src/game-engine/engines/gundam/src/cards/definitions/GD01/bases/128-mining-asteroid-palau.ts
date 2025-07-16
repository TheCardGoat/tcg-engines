import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-128",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 2,
  number: 128,
  name: "Mining Asteroid Palau",
  color: "red",
  set: "GD01",
  rarity: "common",
  type: "base",
  zones: ["space"],
  traits: ["zeon", "stronghold"],
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "placeholder",
          parameters: {},
        },
      ],
      trigger: {
        event: "burst",
      },
      text: "【burst】",
    },
    {
      type: "triggered",
      effects: [
        {
          type: "move-to-hand",
          target: {
            type: "unit",
            value: 1,
            filters: [
              {
                filter: "type",
                value: "unit",
              },
              {
                filter: "owner",
                value: "self",
              },
            ],
            zone: "battlefield",
            isMultiple: false,
          },
          targetText: "1 of your Shields",
          originalText: "Add 1 of your Shields to your hand",
        },
      ],
      trigger: {
        event: "deploy",
      },
      text: "【deploy】",
    },
  ],
  ap: 0,
  hp: 6,
};
