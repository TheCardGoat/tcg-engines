import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const freeze: LorcanitoActionCard = {
  id: "e7s",
  name: "Freeze",
  characteristics: ["action"],
  text: "Exert chosen opposing character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Freeze",
      text: "Exert chosen opposing character.",
      effects: [
        {
          type: "exert",
          exert: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "opponent" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "It's time for you to chill.",
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Cristian Romero",
  number: 63,
  set: "TFC",
  rarity: "common",
};
