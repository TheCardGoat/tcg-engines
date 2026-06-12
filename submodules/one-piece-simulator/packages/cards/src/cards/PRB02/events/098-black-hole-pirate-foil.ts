import type { EventCard } from "@tcg/op-types";
import { prb02BlackHolePirateFoil098I18n } from "./098-black-hole-pirate-foil.i18n.ts";

export const prb02BlackHolePirateFoil098: EventCard = {
  id: "OP09-098",
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "PRB02",
  cost: 4,
  traits: ["Blackbeard Pirates"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-098_r1.jpg",
      imageId: "OP09-098_r1",
    },
  ],
  effect:
    "[Main] If your Leader has the \"Blackbeard Pirates\" type, negate the effect of up to 1 of your opponent's Characters during this turn. Then, if that Character has a cost of 4 or less, K.O. it.[Trigger] Negate the effect of up to 1 of your opponent's Leader or Character cards during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Blackbeard Pirates",
          },
        ],
        actions: [
          {
            action: "negateEffects",
            target: {
              player: "opponent",
              zones: ["character"],
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
  i18n: prb02BlackHolePirateFoil098I18n,
};
