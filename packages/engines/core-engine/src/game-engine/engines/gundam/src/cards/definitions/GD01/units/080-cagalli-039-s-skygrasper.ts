import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-080",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 2,
  number: 80,
  name: "Cagalli&#039;s Skygrasper",
  color: "white",
  set: "GD01",
  rarity: "common",
  type: "unit",
  zones: ["earth"],
  traits: ["earth federation"],
  linkRequirement: ["cagalli yula athha"],
  ap: 2,
  hp: 1,
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
          targetText: "enemy Unit that is Lv",
          originalText: "Choose 1 enemy Unit that is Lv.",
        },
      ],
      trigger: {
        event: "destroyed",
      },
      text: "【destroyed】",
    },
  ],
};
