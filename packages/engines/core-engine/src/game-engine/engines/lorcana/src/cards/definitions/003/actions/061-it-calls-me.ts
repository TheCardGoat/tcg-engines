import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";

export const itCallsMe: LorcanitoActionCard = {
  id: "jqp",
  missingTestCase: true,
  name: "It Calls Me",
  characteristics: ["action", "song"],
  text: "Draw a card. Shuffle up to 3 cards from your opponent's discard into your opponent's deck.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Draw a card. Shuffle up to 3 cards from your opponent's discard into your opponent's deck.",
      resolveEffectsIndividually: true,
      effects: [
        drawACard,
        {
          type: "shuffle",
          amount: 3,
          target: {
            type: "card",
            value: 3,
            upTo: true,
            filters: [
              { filter: "zone", value: "discard" },
              { filter: "owner", value: "opponent" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "I am everything I've learned and more",
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Luis Huerta",
  number: 61,
  set: "ITI",
  rarity: "uncommon",
};
