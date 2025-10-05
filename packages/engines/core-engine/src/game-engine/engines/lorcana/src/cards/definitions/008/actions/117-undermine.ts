import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  discardCardEffect,
  getEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { chosenOpponentTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const undermine: LorcanaActionCardDefinition = {
  id: "hbl",
  name: "Undermine",
  characteristics: ["action"],
  text: "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.",
  type: "action",
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
  inkwell: true,
  colors: ["emerald", "ruby"],
  cost: 2,
  illustrator: "Luigi Aimè",
  number: 117,
  set: "008",
  rarity: "uncommon",
};
