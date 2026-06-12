import type { CharacterCard } from "@tcg/op-types";
import { op11Hibari010I18n } from "./010-hibari.i18n.ts";

export const op11Hibari010: CharacterCard = {
  id: "OP11-010",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP11",
  cost: 5,
  power: 6000,
  traits: ["Navy SWORD"],
  attribute: "ranged",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-010_p1.jpg",
      imageId: "OP11-010_p1",
    },
  ],
  effect:
    '[On Play] Give up to 1 of your opponent\'s Characters 2000 power during this turn.\n[When Attacking] This Character gains +1000 power during this turn. Then, up to 1 of your "Navy" type Leader can also attack active Characters during this turn.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
        ],
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "thisTurn",
          },
          {
            action: "canAttackActive",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Navy",
                },
              ],
            },
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op11Hibari010I18n,
};
