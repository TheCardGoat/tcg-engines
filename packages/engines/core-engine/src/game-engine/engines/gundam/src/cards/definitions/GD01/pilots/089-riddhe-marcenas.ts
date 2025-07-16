import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-089",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 3,
  number: 89,
  name: "Riddhe Marcenas",
  color: "blue",
  set: "GD01",
  rarity: "common",
  type: "pilot",
  traits: ["earth federation"],
  apModifier: 1,
  hpModifier: 1,
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Repair",
        },
      ],
      text: "<Repair>",
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
        {
          type: "attribute-boost",
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
          attribute: "AP",
          amount: 1,
          duration: "turn",
          targetText: "While this Unit has , it",
          originalText: "While this Unit has , it gets AP+1",
        },
      ],
      trigger: {
        event: "burst",
      },
      text: "【burst】",
    },
  ],
};
