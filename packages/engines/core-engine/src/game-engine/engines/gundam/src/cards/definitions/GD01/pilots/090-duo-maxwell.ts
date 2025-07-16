import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-090",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 4,
  number: 90,
  name: "Duo Maxwell",
  color: "green",
  set: "GD01",
  rarity: "rare",
  type: "pilot",
  traits: [],
  apModifier: 1,
  hpModifier: 2,
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
