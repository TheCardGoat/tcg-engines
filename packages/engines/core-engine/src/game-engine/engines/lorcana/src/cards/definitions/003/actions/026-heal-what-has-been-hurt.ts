import { upToValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import {
  drawCardEffect,
  removeDamageEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const healWhatHasBeenHurt: LorcanaActionCardDefinition = {
  id: "ao1",
  name: "Heal What Has Been Hurt",
  characteristics: ["action", "song"],
  text: "Remove up to 3 damage from chosen character. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Remove up to 3 damage from chosen character. Draw a card.",
      targets: [chosenCharacterTarget],
      effects: [
        removeDamageEffect({
          value: upToValue(3),
        }),
        drawCardEffect({ targets: [selfPlayerTarget] }),
      ],
    },
  ],
  flavour: "Let your power shine \nMake the clock reverse . . .",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  illustrator: "Monica Catalano",
  number: 26,
  set: "ITI",
  rarity: "common",
};
