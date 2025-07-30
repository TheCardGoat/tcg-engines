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

export const controlYourTemper: LorcanaActionCardDefinition = {
  id: "eny",
  name: "Control Your Temper!",
  characteristics: ["action"],
  text: "Chosen character gets -2 {S} this turn.",
  type: "action",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Amber Kommavongsa",
  number: 26,
  set: "TFC",
  rarity: "common",
  abilities: [
    {
      type: "static",
      text: "Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn.",
      effects: [
        getEffect({
          targets: [chosenCharacterTarget],
          attribute: "strength",
          value: -2,
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
        gainsAbilityEffect({
          targets: [chosenCharacterOfYoursTarget],
          ability: evasiveAbility,
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
      ],
    },
  ],
};
