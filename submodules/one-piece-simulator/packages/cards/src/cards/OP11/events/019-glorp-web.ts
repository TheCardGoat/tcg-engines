import type { EventCard } from "@tcg/op-types";
import { op11GlorpWeb019I18n } from "./019-glorp-web.i18n.ts";

export const op11GlorpWeb019: EventCard = {
  id: "OP11-019",
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP11",
  cost: 2,
  trigger: "Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  traits: ["Navy SWORD"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if your opponent has a Character with 6000 power or more, up to 1 of your Leader or Character cards gains +1000 power during this turn.",
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
  i18n: op11GlorpWeb019I18n,
};
