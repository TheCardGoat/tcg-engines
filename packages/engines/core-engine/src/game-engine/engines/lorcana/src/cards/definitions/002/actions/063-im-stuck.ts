import { DURING_THEIR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { restrictEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenExertedCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const imStuck: LorcanaActionCardDefinition = {
  id: "t6t",
  name: "I'm Stuck!",
  characteristics: ["action"],
  text: "Chosen exerted character can't ready at the start of their next turn.",
  type: "action",
  flavour: "Oh, bother−not again.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Rob Di Salve",
  number: 63,
  set: "ROF",
  rarity: "common",
  abilities: [
    {
      type: "static",
      text: "Chosen exerted character can't ready at the start of their next turn.",
      targets: [chosenExertedCharacterTarget],
      effects: [
        restrictEffect({
          targets: [chosenExertedCharacterTarget],
          restriction: "ready",
          duration: DURING_THEIR_NEXT_TURN,
        }),
      ],
    },
  ],
};
