import { returnCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterFromDiscardTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const partOfYourWorld: LorcanaActionCardDefinition = {
  id: "ztz",
  name: "Part of Your World",
  characteristics: ["action", "song"],
  text: "Return a character card from your discard to your hand.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Return a character card from your discard to your hand.",
      targets: [chosenCharacterFromDiscardTarget],
      effects: [
        returnCardEffect({
          to: "hand",
          from: "discard",
        }),
      ],
    },
  ],
  flavour: "What would I give\nIf I could live out of these waters?",
  colors: ["amber"],
  cost: 3,
  illustrator: "Samanta Erdini",
  number: 30,
  set: "TFC",
  rarity: "rare",
};
