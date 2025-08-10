import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { getEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const goodJob: LorcanaActionCardDefinition = {
  id: "jmf",
  name: "Good Job!",
  characteristics: ["action"],
  text: "Chosen character gets +1 {L} this turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character gets +1 {L} this turn.",
      targets: [chosenCharacterTarget],
      effects: [
        getEffect({
          attribute: "lore",
          value: 1,
          targets: chosenCharacterTarget,
          duration: THIS_TURN,
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Carlos Gomes Cabral",
  number: 27,
  set: "006",
  rarity: "common",
};
