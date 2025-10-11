import type { GundamitoUnitCard } from "../../cardTypes";

export const card: GundamitoUnitCard = {
  id: "GD01-074",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 2,
  number: 74,
  name: "Chuchu&#039;s Demi Trainer",
  color: "white",
  set: "GD01",
  rarity: "rare",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirement: ["chuatury panlunch"],
  ap: 3,
  hp: 1,
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "draw",
          amount: 1,
        },
        {
          type: "discard",
          amount: 1,
          originalText: "discard 1.",
        },
      ],
      trigger: {
        event: "attack",
      },
      text: "【attack】",
    },
  ],
};
