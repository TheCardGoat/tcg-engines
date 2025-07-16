import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-069",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 69,
  name: "Strike Rouge",
  color: "white",
  set: "GD01",
  rarity: "rare",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["(orb) trait"],
  ap: 3,
  hp: 2,
  abilities: [
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
          condition: ".",
          targetText: "of your rested white Units",
          originalText: "Choose 1 of your rested white Units with .",
        },
      ],
      trigger: {
        event: "once-per-turn",
      },
      text: "【once per turn】",
    },
  ],
};
