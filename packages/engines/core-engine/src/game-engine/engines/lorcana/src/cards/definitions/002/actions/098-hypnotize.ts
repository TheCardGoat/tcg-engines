import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  discardCardEffect,
  getEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { chosenOpponentTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hypnotize: LorcanaActionCardDefinition = {
  id: "awj",
  name: "Hypnotize",
  characteristics: ["action"],
  text: "Each opponent chooses and discards a card. Draw a card.",
  type: "action",
  flavour: "Look me in the eye when I'm speaking to you.",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Lauren Levering",
  number: 98,
  set: "ROF",
  rarity: "common",
  abilities: [
    {
      type: "static",
      text: "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.",
      effects: [
        discardCardEffect({
          targets: [chosenOpponentTarget],
          value: 1,
        }),
        getEffect({
          targets: [chosenCharacterTarget],
          attribute: "strength",
          value: 2,
          duration: THIS_TURN,
        }),
      ],
    },
  ],
};
