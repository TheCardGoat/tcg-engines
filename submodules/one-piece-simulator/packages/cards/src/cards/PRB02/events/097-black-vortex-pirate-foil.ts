import type { EventCard } from "@tcg/op-types";
import { prb02BlackVortexPirateFoil097I18n } from "./097-black-vortex-pirate-foil.i18n.ts";

export const prb02BlackVortexPirateFoil097: EventCard = {
  id: "OP09-097",
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "PRB02",
  cost: 2,
  traits: ["Blackbeard Pirates"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-097_r1.jpg",
      imageId: "OP09-097_r1",
    },
  ],
  effect:
    "[Counter] Negate the effect of up to 1 of your opponent's Leader or Character cards and give that card 4000 power during this turn.[Trigger] Negate the effect of up to 1 of your opponent's Leader or Character cards during this turn.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "negateEffects",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "negateEffects",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: prb02BlackVortexPirateFoil097I18n,
};
