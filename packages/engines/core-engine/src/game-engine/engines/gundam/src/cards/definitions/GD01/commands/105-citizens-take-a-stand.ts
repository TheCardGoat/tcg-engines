import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-105",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 4,
  number: 105,
  name: "Citizens, Take a Stand!",
  color: "green",
  set: "GD01",
  rarity: "rare",
  type: "command",
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
