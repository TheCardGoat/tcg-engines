import type { CharacterCard } from "@tcg/op-types";
import { prb02ShanksP083PirateFoil083I18n } from "./p-083-shanks-p-083-pirate-foil.i18n.ts";

export const prb02ShanksP083PirateFoil083: CharacterCard = {
  id: "P-083",
  canonicalId: "P-083",
  slug: "shanks-p-083-pirate-foil",
  name: "Shanks",
  printings: [
    {
      id: "P-083",
      artId: "P-083",
      setCode: "P",
      collectorNumber: "083",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-083_p3.jpg",
      label: "Shanks - P-083 (Pirate Foil)",
    },
    {
      id: "P-083_r1",
      artId: "P-083_r1",
      setCode: "P",
      collectorNumber: "083",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-083_r1.jpg",
      label: "Shanks - P-083 (Reprint)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["The Four Emperors Red-Haired Pirates"],
  attribute: "slash",
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
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
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
