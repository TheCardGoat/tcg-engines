import type { LeaderCard } from "@tcg/op-types";
import { op11CharlotteKatakuri062I18n } from "./062-charlotte-katakuri.i18n.ts";

export const op11CharlotteKatakuri062: LeaderCard = {
  id: "OP11-062",
  cardType: "leader",
  color: ["purple"],
  rarity: "L",
  setId: "OP11",
  power: 5000,
  life: 5,
  traits: ["Big Mom Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-062_p1.jpg",
      imageId: "OP11-062_p1",
    },
  ],
  effect:
    "[When Attacking]/[On Your Opponent's Attack] [Once Per Turn] DON!! 1: Look at 1 card from the top of your opponent's deck. Then, this Leader gains +1000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "thisBattle",
          },
        ],
        oncePerTurn: true,
      },
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "thisBattle",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11CharlotteKatakuri062I18n,
};
