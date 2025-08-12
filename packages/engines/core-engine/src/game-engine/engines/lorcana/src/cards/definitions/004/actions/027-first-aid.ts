import { upToValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { removeDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { yourCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const firstAid: LorcanaActionCardDefinition = {
  id: "r1q",
  missingTestCase: true,
  name: "First Aid",
  characteristics: ["action"],
  text: "Remove up to 1 damage from each of your characters.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Remove up to 1 damage from each of your characters.",
      targets: [yourCharactersTarget],
      effects: [
        removeDamageEffect({
          value: upToValue(1),
        }),
      ],
    },
  ],
  flavour: "There, now - isn't that better?",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Gonzalo Kenny",
  number: 27,
  set: "URR",
  rarity: "common",
};
