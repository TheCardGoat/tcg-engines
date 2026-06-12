import type { LeaderCard } from "@tcg/op-types";
import { eb02Uta001I18n } from "./001-uta.i18n.ts";

export const eb02Uta001: LeaderCard = {
  id: "OP06-001",
  cardType: "leader",
  color: ["purple", "red"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 4,
  traits: ["FILM"],
  attribute: "special",
  effect:
    '[When Attacking] You may trash 1 "FILM" type card from your hand: Give up to 1 of your opponent\'s Characters 2000 power during this turn. Then, add up to 1 DON!! card from your DON!! deck and rest it.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
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
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb02Uta001I18n,
};
