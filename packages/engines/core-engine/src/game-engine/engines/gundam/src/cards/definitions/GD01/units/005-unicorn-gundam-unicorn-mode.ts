import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-005",
  implemented: false,
  missingTestCase: true,
  cost: 4,
  level: 5,
  number: 5,
  name: "Unicorn Gundam (Unicorn Mode)",
  color: "blue",
  set: "GD01",
  rarity: "rare",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["civilian"],
  linkRequirement: ["banagher links"],
  ap: 4,
  hp: 3,
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "discard",
          amount: 1,
          originalText: "discard 1.",
        },
      ],
      trigger: {
        event: "destroyed",
      },
      text: "【destroyed】",
    },
  ],
};
