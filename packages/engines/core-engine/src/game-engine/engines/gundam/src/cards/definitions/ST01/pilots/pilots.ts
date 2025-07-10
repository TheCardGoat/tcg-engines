import type { GundamitoPilotCard } from "../../cardTypes";

export const amuroRay: GundamitoPilotCard = {
  id: "ST01-010",
  implemented: false,
  cost: 1,
  level: 4,
  name: "Amuro Ray",
  type: "pilot",
  abilities: [
    {
      type: "when-paired",
      text: "Choose 1 enemy Unit with 5 or less HP. Rest it.",
      name: "Amuro Ray's 'when-paired' ability",
      effects: [
        {
          type: "rest",
          rest: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "battle" },
              { filter: "owner", value: "opponent" },
              {
                filter: "attribute",
                value: "hp",
                comparison: { operator: "lte", value: 5 },
              },
            ],
          },
        },
      ],
    },
  ],
  traits: ["earth federation", "white base team", "newtype"],
  apModifier: 2,
  hpModifier: 1,
  rarity: "common",
  color: "blue",
  number: 10,
  set: "ST01",
};

export const sulettaMercury: GundamitoPilotCard = {
  id: "ST01-011",
  implemented: false,
  cost: 1,
  level: 4,
  name: "Suletta Mercury",
  type: "pilot",
  abilities: [],
  traits: ["academy"],
  apModifier: 1,
  hpModifier: 2,
  rarity: "common",
  color: "white",
  number: 11,
  set: "ST01",
};
