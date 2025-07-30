import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { gainsAbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const legendOfTheSwordInTheStone: LorcanaActionCardDefinition = {
  id: "fjm",
  name: "Legend of the Sword in the Stone",
  characteristics: ["action", "song"],
  text: "Chosen character gains **Challenger** +3 this turn.",
  type: "action",
  flavour:
    "A legend is sung of when England was young \nAnd knights were brave and bold",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Kuya Jaypi",
  number: 64,
  set: "ROF",
  rarity: "common",
  abilities: [
    {
      type: "static",
      text: "Chosen character gains **Challenger** +3 this turn.",
      targets: [chosenCharacterTarget],
      effects: [
        gainsAbilityEffect({
          ability: challengerAbility(3),
          duration: THIS_TURN,
        }),
      ],
    },
  ],
};
