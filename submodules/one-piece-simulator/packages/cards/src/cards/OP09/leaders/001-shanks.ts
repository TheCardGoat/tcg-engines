import type { LeaderCard } from "@tcg/op-types";
import { op09Shanks001I18n } from "./001-shanks.i18n.ts";

export const op09Shanks001: LeaderCard = {
  id: "OP09-001",
  cardType: "leader",
  color: ["red"],
  rarity: "L",
  setId: "OP09",
  power: 5000,
  life: 5,
  traits: ["The Four Emperors Red-Haired Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-001_p1.jpg",
      imageId: "OP09-001_p1",
    },
  ],
  effect:
    "[Once Per Turn] This effect can be activated when your opponent attacks. Give up to 1 of your opponent's Leader or Character cards 1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op09Shanks001I18n,
};
