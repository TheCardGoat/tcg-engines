import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-033",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 4,
  number: 33,
  name: "Gundam Deathscythe",
  color: "green",
  set: "GD01",
  rarity: "uncommon",
  type: "unit",
  zones: ["earth"],
  traits: [],
  linkRequirement: ["duo maxwell"],
  ap: 4,
  hp: 3,
  abilities: [
    {
      type: "continuous",
      effects: [
        {
          type: "keyword",
          keyword: "Repair",
          value: 1,
        },
      ],
      text: "<Repair 1>",
    },
  ],
};
