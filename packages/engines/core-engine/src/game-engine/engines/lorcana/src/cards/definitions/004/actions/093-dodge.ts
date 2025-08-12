import { UNTIL_START_OF_YOUR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { gainsAbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dodge: LorcanaActionCardDefinition = {
  id: "ysq",
  name: "Dodge!",
  characteristics: ["action"],
  text: "Chosen character gains **Ward** and **Evasive** until the start of your next turn. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character gains Ward and Evasive until the start of your next turn. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_",
      targets: [chosenCharacterTarget],
      effects: [
        gainsAbilityEffect({
          ability: wardAbility,
          duration: UNTIL_START_OF_YOUR_NEXT_TURN,
        }),
        gainsAbilityEffect({
          ability: evasiveAbility,
          duration: UNTIL_START_OF_YOUR_NEXT_TURN,
        }),
      ],
    },
  ],
  flavour: "Missed me, you doggone bully!",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Wouter Bruneel",
  number: 93,
  set: "URR",
  rarity: "common",
};
