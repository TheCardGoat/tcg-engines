import type { EventCard } from "@tcg/op-types";
import { op12TwoSwordStyleRashomon038I18n } from "./038-two-sword-style-rashomon.i18n.ts";

export const op12TwoSwordStyleRashomon038: EventCard = {
  id: "OP12-038",
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP12",
  cost: 1,
  traits: ["Straw Hat Crew"],
  effect:
    "[Main] You may rest 2 of your DON!! cards: K.O. up to 2 of your opponent's rested Characters with a base cost of 4 or less.\n[Counter] Your Leader gains +3000 power during this battle.",
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
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "baseCost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op12TwoSwordStyleRashomon038I18n,
};
