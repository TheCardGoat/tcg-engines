import type { EventCard } from "@tcg/op-types";
import { op11BlueHole098I18n } from "./098-blue-hole.i18n.ts";

export const op11BlueHole098: EventCard = {
  id: "OP11-098",
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP11",
  cost: 3,
  trigger: "Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  traits: ["Navy"],
  effect:
    "[Main] You may trash 3 cards from the top of your deck: K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11BlueHole098I18n,
};
