import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-094",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 94,
  name: "Yzak Jule",
  color: "red",
  set: "GD01",
  rarity: "uncommon",
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
          type: "destroy",
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
          preventable: true,
        },
        {
          type: "draw",
          amount: 1,
        },
      ],
      trigger: {
        event: "once-per-turn",
      },
      text: "【once per turn】",
    },
  ],
};
