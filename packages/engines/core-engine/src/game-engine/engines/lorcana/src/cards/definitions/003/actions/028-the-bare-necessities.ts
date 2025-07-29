import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { opponentRevealHand } from "@lorcanito/lorcana-engine/effects/effects";

export const theBareNecessities: LorcanitoActionCard = {
  id: "vhx",
  missingTestCase: true,
  name: "The Bare Necessities",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can Exert.png to sing this song for free.)_\n\n\nChosen opponent reveals their hand and discards a non-character card of your choice.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      resolveEffectsIndividually: true,
      effects: [
        opponentRevealHand,
        {
          type: "discard",
          amount: 1,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: ["location", "item", "action"] },
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "opponent" },
            ],
          },
        },
        opponentRevealHand,
      ],
    },
  ],
  flavour: "Forget about your worries and your strife. . . .",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Maxine Vee / David Navarro Arenas",
  number: 28,
  set: "ITI",
  rarity: "rare",
};
