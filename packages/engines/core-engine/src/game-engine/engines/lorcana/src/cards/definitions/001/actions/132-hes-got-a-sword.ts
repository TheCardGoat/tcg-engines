import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { getEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hesGotASword: LorcanaActionCardDefinition = {
  id: "wmw",
  name: "He's Got a Sword!",
  characteristics: ["action"],
  text: "Chosen character gets +2 {S} this turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character gets +2 {S} this turn.",
      targets: [chosenCharacterTarget],
      effects: [
        getEffect({
          attribute: "strength",
          value: 2,
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
      ],
    },
  ],
  flavour: "We've all got swords! \n−Razoul",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Koni",
  number: 132,
  set: "TFC",
  rarity: "common",
};
