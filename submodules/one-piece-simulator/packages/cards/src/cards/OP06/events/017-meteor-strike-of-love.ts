import type { EventCard } from "@tcg/op-types";
import { op06MeteorStrikeOfLove017I18n } from "./017-meteor-strike-of-love.i18n.ts";

export const op06MeteorStrikeOfLove017: EventCard = {
  id: "OP06-017",
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP06",
  cost: 2,
  traits: ["FILM Straw Hat Crew"],
  effect:
    "[Main] / [Counter] You may add 1 card from the top of your Life cards to your hand: Up to 1 of your Leader or Character cards gains +3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
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
            duration: "thisTurn",
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
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op06MeteorStrikeOfLove017I18n,
};
