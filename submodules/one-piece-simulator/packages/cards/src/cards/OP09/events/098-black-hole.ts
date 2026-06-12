import type { EventCard } from "@tcg/op-types";
import { op09BlackHole098I18n } from "./098-black-hole.i18n.ts";

export const op09BlackHole098: EventCard = {
  id: "OP09-098",
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP09",
  cost: 4,
  trigger:
    "Negate the effect of up to 1 of your opponent's Leader or Character cards during this turn.",
  traits: ["Blackbeard Pirates"],
  effect:
    '[Main] If your Leader has the "Blackbeard Pirates" type, negate the effect of up to 1 of your opponent\'s Characters during this turn. Then, if that Character has a cost of 4 or less, K.O. it.',
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
    ],
  },
  i18n: op09BlackHole098I18n,
};
