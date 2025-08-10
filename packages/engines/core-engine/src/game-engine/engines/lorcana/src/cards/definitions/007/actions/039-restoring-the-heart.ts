import { upToValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import {
  drawCardEffect,
  removeDamageEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterOrLocationTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const restoringTheHeart: LorcanaActionCardDefinition = {
  id: "gk9",
  name: "Restoring The Heart",
  characteristics: ["action"],
  text: "Remove up to 3 damage from chosen character or location. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Remove up to 3 damage from chosen character or location. Draw a card.",
      targets: [chosenCharacterOrLocationTarget],
      effects: [
        removeDamageEffect({
          value: upToValue(3),
        }),
        drawCardEffect({ targets: [selfPlayerTarget] }),
      ],
    },
  ],
  inkwell: true,
  colors: ["amber", "sapphire"],
  cost: 1,
  illustrator: "Nicola Saviori / Livio Cacciatore",
  number: 39,
  set: "007",
  rarity: "uncommon",
};
