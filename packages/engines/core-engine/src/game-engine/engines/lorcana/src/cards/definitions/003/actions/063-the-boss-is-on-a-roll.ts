import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";

export const theBossIsOnARoll: LorcanaActionCardDefinition = {
  id: "lfb",
  missingTestCase: true,
  name: "The Boss Is on a Roll",
  characteristics: ["action", "song"],
  text: "_(A character with cost 3 or more can {E} to sing this song for free.)_\n\n\nLook at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Look at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.",
      resolveEffectsIndividually: true,
      effects: [
        youGainLore(1),
        {
          type: "scry",
          amount: 5,
          mode: "both",
          target: self,
          limits: {
            bottom: 5,
            inkwell: 0,
            hand: 0,
            top: 5,
          },
        },
      ],
    },
  ],
  flavour: "Go ahead! Make your choice!",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Koni",
  number: 63,
  set: "ITI",
  rarity: "rare",
};
