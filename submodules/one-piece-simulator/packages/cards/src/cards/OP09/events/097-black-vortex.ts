import type { EventCard } from "@tcg/op-types";
import { op09BlackVortex097I18n } from "./097-black-vortex.i18n.ts";

export const op09BlackVortex097: EventCard = {
  id: "OP09-097",
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP09",
  cost: 2,
  trigger:
    "Negate the effect of up to 1 of your opponent's Leader or Character cards during this turn.",
  traits: ["Blackbeard Pirates"],
  effect:
    "[Counter] Negate the effect of up to 1 of your opponent's Leader or Character cards and give that card 4000 power during this turn.",
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
    ],
  },
  i18n: op09BlackVortex097I18n,
};
