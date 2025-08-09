import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterOrLocationTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const andThenAlongCameZeus: LorcanaActionCardDefinition = {
  id: "k6i",
  name: "And Then Along Came Zeus",
  characteristics: ["action", "song"],
  text: "Deal 5 damage to chosen character or location.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Deal 5 damage to chosen character or location.",
      targets: [chosenCharacterOrLocationTarget],
      effects: [
        dealDamageEffect({
          targets: chosenCharacterOrLocationTarget,
          value: 5,
        }),
      ],
    },
  ],
  flavour:
    "He hurled his thunderbolt−He zapped \nLocked those suckers in a vault−They're trapped \nAnd on his own stopped chaos in its tracks",
  colors: ["steel"],
  cost: 4,
  illustrator: "Isabella Ceravolo",
  number: 195,
  set: "ITI",
  rarity: "rare",
};
