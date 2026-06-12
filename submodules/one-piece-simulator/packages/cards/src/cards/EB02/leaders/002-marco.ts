import type { LeaderCard } from "@tcg/op-types";
import { eb02Marco002I18n } from "./002-marco.i18n.ts";

export const eb02Marco002: LeaderCard = {
  id: "OP08-002",
  cardType: "leader",
  color: ["blue", "red"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 4,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  effect:
    "[DON!! x1] [Activate: Main] [Once Per Turn] Draw 1 card and place 1 card from your hand at the top or bottom of your deck. Then, give up to 1 of your opponent's Characters 2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
              },
            },
            position: "any",
          },
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb02Marco002I18n,
};
