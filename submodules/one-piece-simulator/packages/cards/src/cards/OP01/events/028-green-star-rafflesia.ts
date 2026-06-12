import type { EventCard } from "@tcg/op-types";
import { op01GreenStarRafflesia028I18n } from "./028-green-star-rafflesia.i18n.ts";

export const op01GreenStarRafflesia028: EventCard = {
  id: "OP01-028",
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP01",
  cost: 1,
  traits: ["Straw Hat Crew"],
  effect:
    "[Counter] Give up to 1 of your opponent's Leader or Character cards -2000 power during this turn. [Trigger] Activate this card's [Counter] effect.  This card has been officially errata'd.",
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
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "counter",
          },
        ],
      },
    ],
  },
  i18n: op01GreenStarRafflesia028I18n,
};
