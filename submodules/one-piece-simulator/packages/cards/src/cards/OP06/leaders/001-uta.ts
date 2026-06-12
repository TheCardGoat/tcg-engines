import type { LeaderCard } from "@tcg/op-types";
import { op06Uta001I18n } from "./001-uta.i18n.ts";

export const op06Uta001: LeaderCard = {
  id: "OP06-001",
  cardType: "leader",
  color: ["purple", "red"],
  rarity: "L",
  setId: "OP06",
  power: 5000,
  life: 4,
  traits: ["FILM"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-001_p1.jpg",
      imageId: "OP06-001_p1",
    },
  ],
  effect:
    '[When Attacking] You may trash 1 "FILM" type card from your hand: Give up to 1 of your opponent\'s Characters -2000 power during this turn. Then, add up to 1 DON!! card from your DON!! deck and rest it.',
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
            value: -2000,
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
  i18n: op06Uta001I18n,
};
