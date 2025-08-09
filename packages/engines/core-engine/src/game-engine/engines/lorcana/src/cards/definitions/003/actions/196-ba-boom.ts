import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterOrLocationTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const baBoom: LorcanaActionCardDefinition = {
  id: "oaj",
  name: "Ba-Boom!",
  characteristics: ["action"],
  text: "Deal 2 damage to chosen character or location.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Deal 2 damage to chosen character or location.",
      targets: [chosenCharacterOrLocationTarget],
      effects: [
        dealDamageEffect({
          targets: chosenCharacterOrLocationTarget,
          value: 2,
        }),
      ],
    },
  ],
  flavour: "Bigger than your average boom!",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Heidi Neunhoffer",
  number: 196,
  set: "ITI",
  rarity: "common",
};
