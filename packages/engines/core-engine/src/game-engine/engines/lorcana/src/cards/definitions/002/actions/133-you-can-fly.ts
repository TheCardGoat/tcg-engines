import { UNTIL_START_OF_YOUR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { gainsAbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const youCanFly: LorcanaActionCardDefinition = {
  id: "yio",
  name: "You Can Fly",
  characteristics: ["action", "song"],
  text: "Chosen character gains **Evasive** until the start of your next turn.",
  type: "action",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  illustrator: "Eva Widermann",
  number: 133,
  set: "ROF",
  rarity: "uncommon",
  abilities: [
    {
      type: "static",
      text: "Chosen character gains Evasive until the start of your next turn.",
      targets: [chosenCharacterTarget],
      effects: [
        gainsAbilityEffect({
          ability: evasiveAbility,
          duration: UNTIL_START_OF_YOUR_NEXT_TURN,
        }),
      ],
    },
  ],
};
