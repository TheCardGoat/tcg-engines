import type { CharacterCard } from "@tcg/op-types";
import { prb01CharlotteSmoothieFullArt110I18n } from "./110-charlotte-smoothie-full-art.i18n.ts";

export const prb01CharlotteSmoothieFullArt110: CharacterCard = {
  id: "OP03-110",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "PRB01",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-110_p3.jpg",
      imageId: "OP03-110_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-110_r2.jpg",
      imageId: "OP03-110_r2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-110_p5.jpg",
      imageId: "OP03-110_p5",
    },
  ],
  effect:
    "[When Attacking] You may add 1 card from the top or bottom of your Life cards to your hand: This Character gains +2000 power during this battle.",
  effects: {
    effects: [
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
            value: 2000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb01CharlotteSmoothieFullArt110I18n,
};
