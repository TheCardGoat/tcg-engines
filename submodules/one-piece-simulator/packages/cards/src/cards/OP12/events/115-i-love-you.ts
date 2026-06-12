import type { EventCard } from "@tcg/op-types";
import { op12ILoveYou115I18n } from "./115-i-love-you.i18n.ts";

export const op12ILoveYou115: EventCard = {
  id: "OP12-115",
  cardType: "event",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP12",
  cost: 1,
  traits: ["Donquixote Pirates Navy"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if you have 2 or less Life cards, add up to 1 [Trafalgar Law] from your trash to your hand.",
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
  i18n: op12ILoveYou115I18n,
};
