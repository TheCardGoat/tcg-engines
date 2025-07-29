import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenDamagedCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stampede: LorcanaActionCardDefinition = {
  id: "eje",
  name: "Stampede",
  characteristics: ["action"],
  text: "Deal 2 damage to chosen damaged character.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Deal 2 damage to chosen damaged character.",
      targets: [chosenDamagedCharacterTarget],
      effects: [
        dealDamageEffect({ targets: chosenDamagedCharacterTarget, value: 2 }),
      ],
    },
  ],
  flavour:
    "A wildebeest stampede is like a raging river: best experienced from a distance.",
  colors: ["emerald"],
  cost: 1,
  illustrator: "Matt Chapman",
  number: 96,
  set: "TFC",
  rarity: "common",
};
