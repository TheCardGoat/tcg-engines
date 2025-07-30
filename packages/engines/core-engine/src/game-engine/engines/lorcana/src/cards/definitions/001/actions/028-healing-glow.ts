import { upToValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { removeDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const healingGlow: LorcanaActionCardDefinition = {
  id: "ta0",
  name: "Healing Glow",
  characteristics: ["action"],
  text: "Remove up to 2 damage from chosen character.",
  type: "action",
  rarity: "common",
  flavour: "Don't freak out! Rapunzel",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Philipp Kruse",
  number: 28,
  set: "TFC",
  abilities: [
    {
      type: "static",
      text: "Remove up to 2 damage from chosen character.",
      targets: [chosenCharacterTarget],
      effects: [
        removeDamageEffect({
          value: upToValue(2),
        }),
      ],
    },
  ],
};
