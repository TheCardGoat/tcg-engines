import { chosenDamagedCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import type { DamageEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stampede: LorcanaActionCardDefinition = {
  id: "eje",
  name: "Stampede",
  characteristics: ["action"],
  text: "Deal 2 damage to chosen damaged character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Stampede",
      text: "Deal 2 damage to chosen damaged character.",
      effects: [
        {
          type: "damage",
          amount: 2,
          target: chosenDamagedCharacter,
        } as DamageEffect,
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
