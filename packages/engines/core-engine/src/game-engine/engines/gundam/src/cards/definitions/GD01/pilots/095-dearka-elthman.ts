import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-095",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 95,
  name: "Dearka Elthman",
  color: "red",
  set: "GD01",
  rarity: "common",
  type: "pilot",
  traits: [],
  apModifier: 1,
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
    {
      type: "triggered",
      effects: [
        {
          type: "discard",
          amount: 1,
          originalText: "Discard 1.",
        },
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
