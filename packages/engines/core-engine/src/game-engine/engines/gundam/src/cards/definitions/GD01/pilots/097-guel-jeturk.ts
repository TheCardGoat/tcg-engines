import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-097",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 97,
  name: "Guel Jeturk",
  color: "white",
  set: "GD01",
  rarity: "uncommon",
  type: "pilot",
  traits: ["academy"],
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
  ],
};
