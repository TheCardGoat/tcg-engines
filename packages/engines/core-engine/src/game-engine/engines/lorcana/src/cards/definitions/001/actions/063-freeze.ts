import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const freeze: LorcanaActionCardDefinition = {
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
