import { upToValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import {
  drawCardEffect,
  removeDamageEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const healingTouch: LorcanaActionCardDefinition = {
  id: "i7a",
  name: "Healing Touch",
  characteristics: ["action"],
  text: "Remove up to 4 damage from chosen character. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Remove up to 4 damage from chosen character. Draw a card.",
      effects: [
        removeDamageEffect({
          targets: [chosenCharacterTarget],
          value: upToValue(4),
        }),
        drawCardEffect({ targets: [selfPlayerTarget] }),
      ],
    },
  ],
  flavour:
    "The heart is not so easily changed, but the head can be persuaded.\n—Grand Pabbie",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  illustrator: "Mariana Moreno",
  number: 26,
  set: "SSK",
  rarity: "common",
};
