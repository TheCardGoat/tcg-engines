import type { CharacterCard } from "@tcg/op-types";
import { prb01HodyJones035I18n } from "./035-hody-jones.i18n.ts";

export const prb01HodyJones035: CharacterCard = {
  id: "OP06-035",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "PRB01",
  cost: 7,
  power: 8000,
  traits: ["Fish-Man", "New Fish-Man Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-035_p3.jpg",
      imageId: "OP06-035_p3",
    },
  ],
  effect:
    "[Rush] (This card can attack on the turn in which it is played.) [On Play] Rest up to a total of 2 of your opponent's Characters or DON!! cards. Then, add 1 card from the top of your Life cards to your hand.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character", "costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
          },
        ],
      },
    ],
  },
  i18n: prb01HodyJones035I18n,
};
