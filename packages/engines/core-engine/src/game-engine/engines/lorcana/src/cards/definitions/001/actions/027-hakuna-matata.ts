import { upToValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { removeDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { yourCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hakunaMatata: LorcanaActionCardDefinition = {
  id: "ege",
  name: "Hakuna Matata",
  characteristics: ["action", "song"],
  text: "Remove up to 3 damage from each of your characters.",
  type: "action",
  flavour: "What a wonderful phrase!",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  illustrator: "Juan Diego Leon",
  number: 27,
  set: "TFC",
  rarity: "common",
  abilities: [
    {
      type: "static",
      text: "Remove up to 3 damage from each of your characters.",
      targets: [yourCharactersTarget],
      effects: [
        removeDamageEffect({
          value: upToValue(3),
        }),
      ],
    },
  ],
};
