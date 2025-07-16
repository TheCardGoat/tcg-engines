import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-030",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 30,
  name: "Rick Dom",
  color: "green",
  set: "GD01",
  rarity: "uncommon",
  type: "unit",
  zones: ["space"],
  traits: ["zeon"],
  linkRequirement: ["-"],
  ap: 3,
  hp: 3,
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Breach",
          value: 2,
        },
      ],
      text: "<Breach 2>",
    },
  ],
};
