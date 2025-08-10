import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  drawCardEffect,
  gainsAbilityEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hypnoticStrength: LorcanaActionCardDefinition = {
  id: "ron",
  name: "Hypnotic Strength",
  characteristics: ["action"],
  text: "Draw a card. Chosen character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Draw a card. Chosen character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_",
      effects: [
        drawCardEffect({ targets: [selfPlayerTarget] }),
        gainsAbilityEffect({
          targets: [chosenCharacterTarget],
          ability: challengerAbility(2),
          duration: THIS_TURN,
        }),
      ],
    },
  ],
  flavour: "Suddenly, Basil felt a strong desire to find the broken crown.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Giulia Riva",
  number: 59,
  set: "SSK",
  rarity: "common",
};
