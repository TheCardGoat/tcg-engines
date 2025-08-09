import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { gainsAbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import { chosenCharacterOfYoursTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lastDitchEffort: LorcanaActionCardDefinition = {
  id: "b2t",
  name: "Last-Ditch Effort",
  characteristics: ["action"],
  text: "Exert chosen opposing character. Then chosen character of yours gains **Challenger** +2 this turn. (They get +2 {S} while challenging.)",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Exert chosen opposing character. Then chosen character of yours gains **Challenger** +2 this turn. (They get +2 {S} while challenging.)",
      effects: [
        {
          type: "exert",
          targets: [
            {
              type: "card",
              cardType: "character",
              owner: "opponent",
              count: 1,
            },
          ],
        },
        gainsAbilityEffect({
          targets: [chosenCharacterOfYoursTarget],
          ability: challengerAbility(2),
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
      ],
    },
  ],
  flavour: "I got your back",
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Ian MacDonald",
  number: 62,
  set: "ITI",
  rarity: "uncommon",
};
