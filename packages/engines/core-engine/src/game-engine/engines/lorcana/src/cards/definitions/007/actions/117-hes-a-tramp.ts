import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { getEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterTarget,
  yourCharactersInPlayFilter,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hesATramp: LorcanaActionCardDefinition = {
  id: "s0z",
  name: "He's A Tramp",
  characteristics: ["action", "song"],
  text: "Chosen character gets +1 {S} this turn for each character you have in play.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character gets +1 {S} this turn for each character you have in play.",
      targets: [chosenCharacterTarget],
      effects: [
        getEffect({
          attribute: "strength",
          value: {
            type: "count",
            filter: yourCharactersInPlayFilter,
          },
          targets: chosenCharacterTarget,
          duration: THIS_TURN,
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  illustrator: "Isaiah Mesq",
  number: 117,
  set: "007",
  rarity: "common",
};
