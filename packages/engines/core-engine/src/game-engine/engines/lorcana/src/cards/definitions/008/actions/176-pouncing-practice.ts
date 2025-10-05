import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  gainsAbilityEffect,
  getEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import {
  chosenCharacterOfYoursTarget,
  chosenCharacterTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pouncingPractice: LorcanaActionCardDefinition = {
  id: "bxz",
  name: "Pouncing Practice",
  characteristics: ["action"],
  text: "Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn.",
  type: "action",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Moniek Schilder",
  number: 176,
  set: "008",
  rarity: "uncommon",
  abilities: [
    {
      type: "static",
      text: "Chosen character gets -2 {S} this turn.",
      effects: [
        getEffect({
          targets: [chosenCharacterTarget],
          attribute: "strength",
          value: -2,
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
      ],
    },
    {
      type: "static",
      text: "Chosen character of yours gains Evasive this turn.",
      effects: [
        gainsAbilityEffect({
          targets: [chosenCharacterOfYoursTarget],
          ability: evasiveAbility,
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
      ],
    },
  ],
};
