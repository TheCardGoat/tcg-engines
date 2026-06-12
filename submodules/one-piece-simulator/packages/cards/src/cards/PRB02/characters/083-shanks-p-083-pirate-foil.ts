import type { CharacterCard } from "@tcg/op-types";
import { prb02ShanksP083PirateFoil083I18n } from "./083-shanks-p-083-pirate-foil.i18n.ts";

export const prb02ShanksP083PirateFoil083: CharacterCard = {
  id: "P-083",
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "PRB02",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["The Four Emperors Red-Haired Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-083_r1.jpg",
      imageId: "P-083_r1",
    },
  ],
  effect:
    "[DON!!x1] [When Attacking] You may trash 1 Character card from your hand: Give up to 1 of your opponent's Characters -1000 power during this turn. Then, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
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
            value: -1000,
            duration: "thisTurn",
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02ShanksP083PirateFoil083I18n,
};
