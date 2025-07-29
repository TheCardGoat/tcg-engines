import { returnCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenActionFromDiscardTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const doItAgain: LorcanaActionCardDefinition = {
  id: "yld",
  name: "Do It Again!",
  characteristics: ["action"],
  text: "Return an action card from your discard to your hand.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Return an action card from your discard to your hand.",
      targets: [chosenActionFromDiscardTarget],
      effects: [
        returnCardEffect({
          to: "hand",
          from: "discard",
        }),
      ],
    },
  ],
  flavour:
    ". . . Then scrub the terrace, sweep the halls and the stairs, clean the chimneys. And of course there's the mending, and the sewing, and the laundry . . . −Lady Tremaine",
  colors: ["emerald"],
  cost: 3,
  illustrator: "Ellie Horie",
  number: 94,
  set: "TFC",
  rarity: "rare",
};
