import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-006",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 6,
  name: "Delta Plus",
  color: "blue",
  set: "GD01",
  rarity: "rare",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["(earth federation) trait"],
  ap: 4,
  hp: 3,
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
          type: "attribute-boost",
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
          attribute: "HP",
          amount: 1,
          duration: "turn",
          targetText: "This Unit",
          originalText: "This Unit gets HP+1",
        },
      ],
      trigger: {
        event: "during-link",
      },
      text: "【during link】",
    },
  ],
};
