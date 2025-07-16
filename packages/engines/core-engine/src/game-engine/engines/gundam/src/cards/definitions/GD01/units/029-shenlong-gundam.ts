import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-029",
  implemented: false,
  missingTestCase: true,
  cost: 4,
  level: 5,
  number: 29,
  name: "Shenlong Gundam",
  color: "green",
  set: "GD01",
  rarity: "rare",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["chang wufei"],
  ap: 4,
  hp: 4,
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Breach",
          value: 4,
        },
      ],
      text: "<Breach 4>",
    },
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Blocker",
        },
      ],
      text: "<Blocker>",
    },
    {
      type: "triggered",
      effects: [
        {
          type: "targeting",
          amount: "1",
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
          condition: "that is Lv",
          targetText: "enemy Unit",
          originalText: "Choose 1 enemy Unit with  that is Lv.",
        },
        {
          type: "destroy",
          target: {
            type: "unit",
            value: "opponent",
            filters: [],
          },
          preventable: true,
        },
      ],
      trigger: {
        event: "attack",
      },
      text: "【attack】",
    },
  ],
};
