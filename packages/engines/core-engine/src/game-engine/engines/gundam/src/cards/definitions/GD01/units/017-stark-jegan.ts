import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-017",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 3,
  number: 17,
  name: "Stark Jegan",
  color: "blue",
  set: "GD01",
  rarity: "common",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["(earth federation) trait"],
  ap: 3,
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
