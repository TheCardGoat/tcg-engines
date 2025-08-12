import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { gainsAbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const duckForCover: LorcanaActionCardDefinition = {
  id: "jqo",
  name: "Duck for Cover!",
  characteristics: ["action"],
  text: "Chosen character gains **Resist** +1 and **Evasive** this turn. _(Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)_",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character gains **Resist** +1 and **Evasive** this turn. _(Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)_",
      targets: [chosenCharacterTarget],
      effects: [
        gainsAbilityEffect({
          ability: resistAbility(1),
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
        gainsAbilityEffect({
          ability: evasiveAbility,
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Gianluca Barone",
  number: 198,
  set: "SSK",
  rarity: "common",
};
