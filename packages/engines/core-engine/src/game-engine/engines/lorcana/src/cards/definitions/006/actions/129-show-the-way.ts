import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { getEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { yourCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const showTheWay: LorcanaActionCardDefinition = {
  id: "lfi",
  missingTestCase: true,
  name: "Lead The Way",
  characteristics: ["action"],
  text: "Your characters get +2 {S} this turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Your characters get +2 {S} this turn.",
      targets: [yourCharactersTarget],
      effects: [
        getEffect({
          attribute: "strength",
          value: 2,
          duration: THIS_TURN,
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 0,
  illustrator: "Amanda MacFarlane",
  number: 129,
  set: "006",
  rarity: "common",
};
