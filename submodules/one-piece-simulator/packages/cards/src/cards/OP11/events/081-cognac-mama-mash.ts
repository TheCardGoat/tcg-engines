import type { EventCard } from "@tcg/op-types";
import { op11CognacMamaMash081I18n } from "./081-cognac-mama-mash.i18n.ts";

export const op11CognacMamaMash081: EventCard = {
  id: "OP11-081",
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "OP11",
  cost: 6,
  trigger: "Add up to 1 DON!! card from your DON!! deck and set it as active.",
  traits: ["The Four Emperors Big Mom Pirates"],
  effect:
    "[Main] Choose a cost and reveal 1 card from the top of your opponent's deck. If the revealed card has the chosen cost, K.O. up to 1 of your opponent's Characters with a base cost of 8 or less.",
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
                  filter: "baseCost",
                  comparison: "lte",
                  value: 8,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op11CognacMamaMash081I18n,
};
