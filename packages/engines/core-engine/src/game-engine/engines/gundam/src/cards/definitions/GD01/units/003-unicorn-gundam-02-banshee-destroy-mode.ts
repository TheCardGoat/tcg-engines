import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-003",
  implemented: false,
  missingTestCase: true,
  cost: 4,
  level: 6,
  number: 3,
  name: "Unicorn Gundam 02 Banshee (Destroy Mode)",
  color: "blue",
  set: "GD01",
  rarity: "legendary",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["marida cruz"],
  ap: 5,
  hp: 4,
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "targeting",
          amount: "12",
          target: {
            type: "unit",
            value: 1,
            filters: [
              {
                filter: "type",
                value: "unit",
              },
              {
                filter: "owner",
                value: "self",
              },
            ],
            zone: "battlefield",
            isMultiple: false,
          },
          condition: "",
          targetText: "cards from your trash",
          originalText: "Choose 12 cards from your trash.",
        },
      ],
      trigger: {
        event: "attack",
      },
      text: "【attack】",
    },
  ],
};
