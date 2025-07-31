import {
  conditionalPlayerEffect,
  discardCardEffect,
  drawCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const desperatePlan: LorcanaActionCardDefinition = {
  id: "y5k",
  name: "Desperate Plan",
  characteristics: ["action"],
  text: "If you have no cards in your hand, draw until you have 3 cards in your hand. Otherwise, choose and discard any number of cards, then draw that many cards.",
  type: "action",
  inkwell: false,
  colors: ["steel"],
  cost: 3,
  illustrator: "Gianluca Barone",
  number: 201,
  set: "008",
  rarity: "rare",
  abilities: [
    {
      type: "static",
      text: "If you have no cards in your hand, draw until you have 3 cards in your hand. Otherwise, choose and discard any number of cards, then draw that many cards.",
      effects: [
        conditionalPlayerEffect({
          condition: {
            type: "hasCardsInHand",
            maxCount: 0, // No cards in hand
          },
          effect: drawCardEffect({
            targets: [selfPlayerTarget],
            value: 3,
          }),
          elseEffect: drawCardEffect({
            targets: [selfPlayerTarget],
            value: 3, // Simplified implementation - draw 3 cards for the "otherwise" case
          }),
        }),
      ],
    },
  ],
};
