import { returnCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const motherKnowsBest: LorcanaActionCardDefinition = {
  id: "rxk",
  name: "Mother Knows Best",
  characteristics: ["action", "song"],
  text: "Return chosen character to their player's hand.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Return chosen character to their player's hand.",
      targets: [chosenCharacterTarget],
      effects: [
        returnCardEffect({
          to: "hand",
          from: "play",
        }),
      ],
    },
  ],
  flavour: "One way or another \nSomething will go wrong, I swear",
  colors: ["emerald"],
  cost: 3,
  illustrator: "R. La Barbera / L. Giammichele",
  number: 95,
  set: "TFC",
  rarity: "uncommon",
};
