import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-091",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 4,
  number: 91,
  name: "Chang Wufei",
  color: "green",
  set: "GD01",
  rarity: "uncommon",
  type: "pilot",
  traits: [],
  apModifier: 2,
  hpModifier: 1,
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Breach",
        },
      ],
      text: "<Breach>",
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
