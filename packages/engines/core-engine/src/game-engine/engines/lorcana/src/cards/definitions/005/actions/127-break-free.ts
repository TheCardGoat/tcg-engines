import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  dealDamageEffect,
  gainsAbilityEffect,
  getEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import { chosenCharacterOfYoursTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const breakFree: LorcanaActionCardDefinition = {
  id: "qdj",
  name: "Break Free",
  characteristics: ["action"],
  text: "Deal 1 damage to chosen character of yours. They gain **Rush** and get +1 {S} this turn. _(They can challenge the turn they're played.)_",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Deal 1 damage to chosen character of yours. They gain **Rush** and get +1 {S} this turn. _(They can challenge the turn they're played.)_",
      targets: [chosenCharacterOfYoursTarget],
      effects: [
        dealDamageEffect({
          targets: [chosenCharacterOfYoursTarget],
          value: 1,
        }),
        gainsAbilityEffect({
          ability: rushAbility,
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
        getEffect({
          attribute: "strength",
          value: 1,
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
      ],
    },
  ],
  flavour: "Tink darted from the shattered lantern in the blink of an eye.",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Brian Kesinger",
  number: 127,
  set: "SSK",
  rarity: "common",
};
