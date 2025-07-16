import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-041",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 41,
  name: "Shenlong Gundam",
  color: "green",
  set: "GD01",
  rarity: "common",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["chang wufei"],
  ap: 4,
  hp: 3,
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Breach",
          value: 3,
        },
      ],
      text: "<Breach 3>",
    },
  ],
};
