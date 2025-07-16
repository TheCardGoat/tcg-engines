import type { GundamitoCard } from "../../cardTypes";

export const card: GundamitoCard = {
  id: "GD01-054",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 54,
  name: "Duel Gundam",
  color: "red",
  set: "GD01",
  rarity: "rare",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["(zaft) trait"],
  ap: 3,
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
