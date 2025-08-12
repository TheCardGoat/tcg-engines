import { playCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const revive: LorcanaActionCardDefinition = {
  id: "xie",
  missingTestCase: true,
  name: "Revive",
  characteristics: ["action"],
  text: "Play a character card with cost 5 or less from your discard for free.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Play a character card with cost 5 or less from your discard for free.",
      effects: [
        playCardEffect({
          from: "discard",
          cost: "free",
          filter: {
            cardType: "character",
            cost: { max: 5 },
          },
        }),
      ],
    },
  ],
  flavour: "Not all that is lost is gone forever.",
  colors: ["amber"],
  cost: 5,
  illustrator: "Jared Matthews",
  number: 27,
  set: "SSK",
  rarity: "rare",
};
