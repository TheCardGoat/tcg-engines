import { optionalPlayEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  eachOpponentTarget,
  selfPlayerTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theReturnOfHercules: LorcanaActionCardDefinition = {
  id: "zun",
  name: "The Return Of Hercules",
  characteristics: ["action"],
  text: "Each player may reveal a character card from their hand and play it for free.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Each player may reveal a character card from their hand and play it for free.",
      effects: [
        optionalPlayEffect({
          targets: [selfPlayerTarget],
          from: "hand",
          cost: "free",
          filter: { cardType: "character" },
          reveal: true,
        }),
        optionalPlayEffect({
          targets: [eachOpponentTarget],
          from: "hand",
          cost: "free",
          filter: { cardType: "character" },
          reveal: true,
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  illustrator: "Kevin Sidharta",
  number: 118,
  set: "007",
  rarity: "legendary",
};
