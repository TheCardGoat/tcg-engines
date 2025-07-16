import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-098",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 4,
  number: 98,
  name: "Elan Ceres (Enhanced Person Number 4)",
  color: "white",
  set: "GD01",
  rarity: "common",
  type: "pilot",
  traits: ["academy"],
  apModifier: 2,
  hpModifier: 1,
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "move-to-hand",
          target: {
            type: "unit",
            value: "self",
            filters: [
              {
                filter: "type",
                value: "unit",
              },
            ],
            zone: "battlefield",
          },
          targetText: "this card",
          originalText: "Add this card to your hand",
        },
      ],
      trigger: {
        event: "burst",
      },
      text: "【burst】",
    },
  ],
};
