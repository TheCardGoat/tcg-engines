import type { EventCard } from "@tcg/op-types";
import { op06TheBillionFoldWorldTrichiliocosm038I18n } from "./038-the-billion-fold-world-trichiliocosm.i18n.ts";

export const op06TheBillionFoldWorldTrichiliocosm038: EventCard = {
  id: "OP06-038",
  cardType: "event",
  color: ["green"],
  rarity: "UC",
  setId: "OP06",
  cost: 1,
  trigger: "K.O. up to 1 of your opponent's rested Characters with a cost of 3 or less.",
  traits: ["Straw Hat Crew Dressrosa"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if you have 8 or more rested cards, that card gains an additional +2000 power during this battle.",
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
  i18n: op06TheBillionFoldWorldTrichiliocosm038I18n,
};
