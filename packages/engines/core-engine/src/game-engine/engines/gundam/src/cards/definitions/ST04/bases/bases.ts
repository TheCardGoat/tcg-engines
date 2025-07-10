import type { GundamitoBaseCard } from "../../cardTypes";

export const archangel: GundamitoBaseCard = {
  id: "ST04-015",
  implemented: false,
  cost: 1,
  level: 3,
  type: "base",
  name: "Archangel",
  color: "white",
  abilities: [
    {
      type: "deploy",
      text: "Add 1 of your Shields to your hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            random: true,
            filters: [
              {
                filter: "owner",
                value: "self",
              },
              {
                filter: "zone",
                value: "shield",
              },
            ],
          },
        },
      ],
    },
  ],
  zones: ["space", "earth"],
  set: "ST04",
  traits: ["earth alliance", "warship"],
  ap: 0,
  hp: 5,
  number: 15,
  rarity: "common",
};
