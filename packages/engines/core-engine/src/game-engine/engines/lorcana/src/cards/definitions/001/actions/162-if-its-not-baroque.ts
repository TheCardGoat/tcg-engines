import { returnCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenItemTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ifItsNotBaroque: LorcanaActionCardDefinition = {
  id: "m65",
  name: "If It's Not Baroque",
  characteristics: ["action"],
  text: "Return an item card from your discard to your hand.",
  type: "action",
  flavour: ". . . Don't fix it.",
  colors: ["sapphire"],
  cost: 3,
  illustrator: "Kenneth Anderson",
  number: 162,
  set: "TFC",
  rarity: "rare",
  abilities: [
    {
      type: "static",
      text: "Return an item card from your discard to your hand.",
      targets: [chosenItemTarget],
      effects: [
        returnCardEffect({
          from: "discard",
          to: "hand",
        }),
      ],
    },
  ],
};
