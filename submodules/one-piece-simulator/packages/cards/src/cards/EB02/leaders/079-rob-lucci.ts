import type { LeaderCard } from "@tcg/op-types";
import { eb02RobLucci079I18n } from "./079-rob-lucci.i18n.ts";

export const eb02RobLucci079: LeaderCard = {
  id: "OP07-079",
  cardType: "leader",
  color: ["black"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 5,
  traits: ["CP0"],
  attribute: "strike",
  effect:
    "[When Attacking] You may trash 2 cards from the top of your deck: Give up to 1 of your opponent's Characters 1 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb02RobLucci079I18n,
};
