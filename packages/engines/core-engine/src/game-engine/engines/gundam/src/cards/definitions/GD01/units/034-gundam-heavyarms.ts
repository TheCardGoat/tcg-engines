import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-034",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 34,
  name: "Gundam Heavyarms",
  color: "green",
  set: "GD01",
  rarity: "uncommon",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["trowa barton"],
  ap: 3,
  hp: 4,
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
