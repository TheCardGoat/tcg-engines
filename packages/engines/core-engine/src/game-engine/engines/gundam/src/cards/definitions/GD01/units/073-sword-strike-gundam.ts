import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-073",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 73,
  name: "Sword Strike Gundam",
  color: "white",
  set: "GD01",
  rarity: "uncommon",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["(earth alliance) trait"],
  ap: 4,
  hp: 3,
  abilities: [
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
          condition: "2 or less HP",
          targetText: "enemy Unit",
          originalText: "Choose 1 enemy Unit with 2 or less HP.",
        },
      ],
      trigger: {
        event: "attack",
      },
      text: "【attack】",
    },
  ],
};
