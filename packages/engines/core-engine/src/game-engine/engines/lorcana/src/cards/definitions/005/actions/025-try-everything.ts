import { upToValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  removeDamageEffect,
  restrictEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tryEverything: LorcanaActionCardDefinition = {
  id: "vjj",
  missingTestCase: true,
  name: "Try Everything",
  characteristics: ["action", "song"],
  text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n<br>Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.",
      targets: [chosenCharacterTarget],
      effects: [
        removeDamageEffect({
          targets: [chosenCharacterTarget],
          value: upToValue(3),
        }),
        { type: "ready", targets: [chosenCharacterTarget] },
        restrictEffect({
          targets: [chosenCharacterTarget],
          restriction: "quest",
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
        restrictEffect({
          targets: [chosenCharacterTarget],
          restriction: "challenge",
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
      ],
    },
  ],
  flavour: "I want to try even though I could fail",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  illustrator: "Nicolas Ky",
  number: 25,
  set: "SSK",
  rarity: "uncommon",
};
