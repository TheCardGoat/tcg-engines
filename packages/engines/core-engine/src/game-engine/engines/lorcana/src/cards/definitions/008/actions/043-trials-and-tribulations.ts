import { UNTIL_START_OF_YOUR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { getEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const trialsAndTribulations: LorcanaActionCardDefinition = {
  id: "rky",
  name: "Trials And Tribulations",
  characteristics: ["action", "song"],
  text: "Chosen character gets -4 {S} until the start of your next turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character gets -4 {S} until the start of your next turn.",
      targets: [chosenCharacterTarget],
      effects: [
        getEffect({
          attribute: "strength",
          value: -4,
          targets: [chosenCharacterTarget],
          duration: UNTIL_START_OF_YOUR_NEXT_TURN,
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Pauline Voss",
  number: 43,
  set: "008",
  rarity: "uncommon",
};
