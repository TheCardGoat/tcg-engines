import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  drawCardEffect,
  getEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const distract: LorcanaActionCardDefinition = {
  id: "hb0",
  name: "Distract",
  characteristics: ["action"],
  text: "Chosen character gets -2 {S} this turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character gets -2 {S} this turn. Draw a card.",
      effects: [
        getEffect({
          targets: [chosenCharacterTarget],
          attribute: "strength",
          value: -2,
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
        drawCardEffect({ targets: [selfPlayerTarget] }),
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Giuseppe de Maio",
  number: 159,
  set: "ITI",
  rarity: "common",
};
