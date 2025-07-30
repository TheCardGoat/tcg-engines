import { upToValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import {
  drawCardEffect,
  removeDamageEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const holdStill: LorcanaActionCardDefinition = {
  id: "y6k",
  name: "Hold Still",
  characteristics: ["action"],
  text: "Remove up to 4 damage from chosen character.",
  type: "action",
  flavour: "This might sting a little.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Connie Kang / Jackie Droujko",
  number: 28,
  set: "ROF",
  rarity: "common",
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
};
