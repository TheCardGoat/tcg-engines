import { chosenOpposingCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const freeze: LorcanaActionCardDefinition = {
  id: "e7s",
  name: "Freeze",
  characteristics: ["action"],
  text: "Exert chosen opposing character.",
  type: "action",
  flavour: "It's time for you to chill.",
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Cristian Romero",
  number: 63,
  set: "TFC",
  rarity: "common",
  abilities: [
    {
      type: "static",
      text: "Exert chosen opposing character.",
      targets: [chosenOpposingCharacterTarget],
      effects: [
        {
          type: "exert",
        },
      ],
    },
  ],
};
