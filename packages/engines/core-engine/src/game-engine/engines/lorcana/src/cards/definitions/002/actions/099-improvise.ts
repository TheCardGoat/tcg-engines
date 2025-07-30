import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  drawCardEffect,
  getEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const improvise: LorcanaActionCardDefinition = {
  id: "m0h",
  name: "Improvise",
  characteristics: ["action"],
  text: "Chosen character gets +1 {S} this turn. Draw a card.",
  type: "action",
  flavour: "Shan-Yu: It looks like you're out of ideas. \nMulan: Not quite!",
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  illustrator: "Mane Kandalyan",
  number: 99,
  set: "ROF",
  rarity: "common",
  abilities: [
    {
      type: "static",
      text: "Chosen character gets +1 {S} this turn. Draw a card.",
      effects: [
        getEffect({
          attribute: "strength",
          value: 1,
          targets: chosenCharacterTarget,
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
        drawCardEffect({ targets: [selfPlayerTarget], value: 1 }),
      ],
    },
  ],
};
