import type { EventCard } from "@tcg/op-types";
import { prb02SixKingPistolReprint097I18n } from "./097-six-king-pistol-reprint.i18n.ts";

export const prb02SixKingPistolReprint097: EventCard = {
  id: "OP03-097",
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "PRB02",
  cost: 0,
  traits: ["CP9"],
  effect:
    '[Counter] You may trash 1 card from your hand: Up to 1 of your Leader or Character cards gains +3000 power during this battle.[Trigger] Draw 1 card. Then, K.O. up to 1 of your opponent\'s Characters with a cost of 1 or less.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
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
            value: 3000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
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
                  value: 1,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb02SixKingPistolReprint097I18n,
};
