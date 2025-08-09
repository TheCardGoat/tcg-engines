import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { getEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const seldomAllTheySeem: LorcanaActionCardDefinition = {
  id: "esk",
  name: "Seldom All They Seem",
  characteristics: ["action", "song"],
  text: "Chosen character gets -3 {S} this turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character gets -3 {S} this turn.",
      targets: [chosenCharacterTarget],
      effects: [
        getEffect({
          attribute: "strength",
          value: -3,
          targets: chosenCharacterTarget,
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
      ],
    },
  ],
  flavour: "I know you\nI walked with you once upon a dream",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Rachel Elese",
  number: 164,
  set: "URR",
  rarity: "common",
};
