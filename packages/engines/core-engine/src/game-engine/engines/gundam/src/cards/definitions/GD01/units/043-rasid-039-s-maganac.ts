import type { GundamitoUnitCard } from "../../cardTypes";

export const card: GundamitoUnitCard = {
  id: "GD01-043",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 43,
  name: "Rasid&#039;s Maganac",
  color: "green",
  set: "GD01",
  rarity: "common",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["(maganac corps) trait"],
  ap: 2,
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
          condition: "",
          targetText: "of your green Units",
          originalText: "Choose 1 of your green Units.",
        },
      ],
      trigger: {
        event: "deploy",
      },
      text: "【deploy】",
    },
  ],
};
