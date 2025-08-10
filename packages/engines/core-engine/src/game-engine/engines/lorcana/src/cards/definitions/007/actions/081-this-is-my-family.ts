import {
  drawCardEffect,
  gainLoreEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const thisIsMyFamily: LorcanaActionCardDefinition = {
  id: "nk5",
  name: "This Is My Family",
  characteristics: ["action", "song"],
  text: "Gain 1 lore. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Gain 1 lore. Draw a card.",
      effects: [
        gainLoreEffect({ targets: [selfPlayerTarget], value: 1 }),
        drawCardEffect({ targets: [selfPlayerTarget] }),
      ],
    },
  ],
  inkwell: false,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Cristian Romero",
  number: 81,
  set: "007",
  rarity: "common",
};
