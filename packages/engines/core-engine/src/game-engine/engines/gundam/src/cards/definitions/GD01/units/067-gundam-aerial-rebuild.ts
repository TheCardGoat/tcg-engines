import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-067",
  implemented: false,
  missingTestCase: true,
  cost: 5,
  level: 6,
  number: 67,
  name: "Gundam Aerial Rebuild",
  color: "white",
  set: "GD01",
  rarity: "legendary",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirement: ["suletta mercury"],
  ap: 5,
  hp: 4,
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
          targetText: "Command card that is Lv",
          originalText: "Choose 1 Command card that is Lv.",
        },
        {
          type: "move-to-hand",
          target: {
            type: "unit",
            value: "self",
            filters: [],
          },
          targetText: "it",
          originalText: "Add it to your hand",
        },
      ],
      trigger: {
        event: "when-paired",
      },
      text: "【when paired】",
    },
  ],
};
