import type { EventCard } from "@tcg/op-types";
import { op04HappinessPunch017I18n } from "./017-happiness-punch.i18n.ts";

export const op04HappinessPunch017: EventCard = {
  id: "OP04-017",
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP04",
  cost: 1,
  traits: ["Alabasta Straw Hat Crew"],
  effect:
    "[Counter] Give up to 1 of your opponent's Leader or Character cards -2000 power during this turn. Then, if your Leader is active, give up to 1 of your opponent's Leader or Character cards -1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op04HappinessPunch017I18n,
};
