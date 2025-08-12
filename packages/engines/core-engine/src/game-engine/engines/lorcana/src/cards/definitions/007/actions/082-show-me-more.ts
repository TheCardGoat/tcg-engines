import { drawCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  eachOpponentTarget,
  selfPlayerTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const showMeMore: LorcanaActionCardDefinition = {
  id: "f8z",
  name: "Show Me More!",
  characteristics: ["action"],
  text: "Each player draws 3 cards.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Each player draws 3 cards.",
      effects: [
        drawCardEffect({ targets: [selfPlayerTarget], value: 3 }),
        drawCardEffect({ targets: [eachOpponentTarget], value: 3 }),
      ],
    },
  ],
  inkwell: false,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Natalie Dombois",
  number: 82,
  set: "007",
  rarity: "super_rare",
};
