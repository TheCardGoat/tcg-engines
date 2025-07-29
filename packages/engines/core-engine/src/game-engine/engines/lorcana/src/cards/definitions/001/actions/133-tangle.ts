import type { LoreEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tangle: LorcanaActionCardDefinition = {
  id: "kni",
  name: "Tangle",
  characteristics: ["action"],
  text: "Each opponent loses 1 lore.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "lore",
          amount: 1,
          modifier: "subtract",
          target: {
            type: "player",
            value: "opponent",
          },
        } as LoreEffect,
      ],
    },
  ],
  flavour:
    "Stay right here! I mean, you don't have a choice, I guess. But still! Don't move! \n− Rapunzel",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  illustrator: "Eri Welli",
  number: 133,
  set: "TFC",
  rarity: "common",
};
