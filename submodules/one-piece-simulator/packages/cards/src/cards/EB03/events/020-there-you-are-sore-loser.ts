import type { EventCard } from "@tcg/op-types";
import { eb03ThereYouAreSoreLoser020I18n } from "./020-there-you-are-sore-loser.i18n.ts";

export const eb03ThereYouAreSoreLoser020: EventCard = {
  id: "EB03-020",
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "EB03",
  cost: 1,
  traits: ["FILM"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if you have 2 or more {FILM} type Characters, that card gains an additional +2000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: eb03ThereYouAreSoreLoser020I18n,
};
