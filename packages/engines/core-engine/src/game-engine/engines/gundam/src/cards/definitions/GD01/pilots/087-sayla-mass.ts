import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-087",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 87,
  name: "Sayla Mass",
  color: "blue",
  set: "GD01",
  rarity: "rare",
  type: "pilot",
  traits: ["earth federation", "newtype"],
  apModifier: 1,
  hpModifier: 1,
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Repair",
          value: 1,
        },
      ],
      text: "<Repair 1>",
    },
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
