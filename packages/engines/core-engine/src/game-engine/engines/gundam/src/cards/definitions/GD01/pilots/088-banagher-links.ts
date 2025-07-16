import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-088",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 5,
  number: 88,
  name: "Banagher Links",
  color: "blue",
  set: "GD01",
  rarity: "uncommon",
  type: "pilot",
  traits: ["civilian", "newtype"],
  apModifier: 2,
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
    {
      type: "triggered",
      effects: [
        {
          type: "draw",
          amount: 1,
        },
      ],
      trigger: {
        event: "when-linked",
      },
      text: "【when linked】",
    },
  ],
};
