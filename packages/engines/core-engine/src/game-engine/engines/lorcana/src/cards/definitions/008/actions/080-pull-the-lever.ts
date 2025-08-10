import {
  discardCardEffect,
  drawCardEffect,
  modalEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  eachOpponentTarget,
  selfPlayerTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pullTheLever: LorcanaActionCardDefinition = {
  id: "sp7",
  name: "Pull The Lever!",
  characteristics: ["action"],
  text: "Choose one:\n- Draw 2 cards.\n- Each opponent chooses and discards a card.",
  type: "action",
  inkwell: true,
  colors: ["amethyst", "emerald"],
  cost: 3,
  illustrator: "Mario Manzanares",
  number: 80,
  set: "008",
  rarity: "uncommon",
  abilities: [
    {
      type: "static",
      text: "Choose one:\n- Draw 2 cards.\n- Each opponent chooses and discards a card.",
      effects: [
        modalEffect([
          {
            text: "Draw 2 cards.",
            effects: [
              drawCardEffect({ targets: [selfPlayerTarget], value: 2 }),
            ],
          },
          {
            text: "Each opponent chooses and discards a card.",
            effects: [
              discardCardEffect({ value: 1, targets: [eachOpponentTarget] }),
            ],
          },
        ]),
      ],
    },
  ],
};
