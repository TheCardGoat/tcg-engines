import {
  drawCardEffect,
  putCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { upToTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const itCallsMe: LorcanaActionCardDefinition = {
  id: "jqp",
  missingTestCase: true,
  name: "It Calls Me",
  characteristics: ["action", "song"],
  text: "Draw a card. Shuffle up to 3 cards from your opponent's discard into your opponent's deck.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Draw a card. Shuffle up to 3 cards from your opponent's discard into your opponent's deck.",
      effects: [
        drawCardEffect({ targets: [selfPlayerTarget] }),
        putCardEffect({
          to: "deck",
          from: "discard",
          targets: upToTarget({
            target: {
              type: "card",
              zone: "discard",
              owner: "opponent",
              count: 1,
            },
            upTo: 3,
          }),
          shuffle: true,
        }),
      ],
    },
  ],
  flavour: "I am everything I've learned and more",
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Luis Huerta",
  number: 61,
  set: "ITI",
  rarity: "uncommon",
};
