import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-039",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 1,
  number: 39,
  name: "Dopp",
  color: "green",
  set: "GD01",
  rarity: "common",
  type: "unit",
  zones: ["earth"],
  traits: ["zeon"],
  linkRequirement: ["-"],
  ap: 1,
  hp: 1,
  abilities: [
    {
      type: "triggered",
      effects: [
        {
          type: "placeholder",
          parameters: {},
        },
      ],
      trigger: {
        event: "deploy",
      },
      text: "【deploy】",
    },
  ],
};
