import { upToValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { removeDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenLocationTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const quickPatch: LorcanaActionCardDefinition = {
  id: "p6z",
  name: "Quick Patch",
  characteristics: ["action"],
  text: "Remove up to 3 damage from chosen location.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Remove up to 3 damage from chosen location.",
      targets: [chosenLocationTarget],
      effects: [
        removeDamageEffect({
          value: upToValue(3),
        }),
      ],
    },
  ],
  flavour: "Good as new! Well, almost.",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Wouter Bruneel",
  number: 27,
  set: "ITI",
  rarity: "common",
};
