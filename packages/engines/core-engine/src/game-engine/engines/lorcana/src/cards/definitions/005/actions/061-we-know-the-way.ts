import {
  conditionalEffect,
  optionalPlayEffect,
  putCardEffect,
  revealEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const weKnowTheWay: LorcanaActionCardDefinition = {
  id: "tc8",
  name: "We Know The Way",
  characteristics: ["action", "song"],
  text: "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
      targets: [
        {
          type: "card",
          zone: "discard",
          owner: "self",
          count: 1,
        },
      ],
      effects: [
        putCardEffect({
          to: "deck",
          from: "discard",
          shuffle: true,
        }),
        revealEffect({
          targets: [selfPlayerTarget],
          from: "deck",
          count: 1,
          position: "top",
          thenEffect: conditionalEffect({
            condition: {
              type: "sameName",
              compareWith: "previousTarget",
            },
            ifTrue: optionalPlayEffect({
              targets: [selfPlayerTarget],
              from: "deck",
              cost: "free",
              filter: { zone: "deck", position: "top" },
            }),
            ifFalse: putCardEffect({
              to: "hand",
              from: "deck",
              position: "top",
            }),
          }),
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Jake Murphy",
  number: 61,
  set: "SSK",
  rarity: "rare",
};
