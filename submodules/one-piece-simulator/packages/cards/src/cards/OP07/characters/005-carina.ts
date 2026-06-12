import type { CharacterCard } from "@tcg/op-types";
import { op07Carina005I18n } from "./005-carina.i18n.ts";

export const op07Carina005: CharacterCard = {
  id: "OP07-005",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP07",
  cost: 3,
  power: 0,
  counter: 1000,
  traits: ["FILM Grantesoro"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-005_p1.jpg",
      imageId: "OP07-005_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Give up to 1 of your opponent's Characters -2000 power during this turn.",
  effects: {
    keywords: ["blocker"],
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
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op07Carina005I18n,
};
