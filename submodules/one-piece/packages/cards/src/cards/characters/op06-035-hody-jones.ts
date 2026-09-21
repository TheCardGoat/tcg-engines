import type { CharacterCard } from "@tcg/op-types";
import { op06HodyJones035I18n } from "./op06-035-hody-jones.i18n.ts";

export const op06HodyJones035: CharacterCard = {
  id: "OP06-035",
  canonicalId: "OP06-035",
  slug: "hody-jones/op06-035",
  name: "Hody Jones",
  printings: [
    {
      id: "OP06-035",
      artId: "OP06-035",
      setCode: "OP06",
      collectorNumber: "035",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-035.jpg",
    },
    {
      id: "OP06-035_p1",
      artId: "OP06-035_p1",
      setCode: "OP06",
      collectorNumber: "035",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-035_p1.jpg",
    },
    {
      id: "OP06-035_p3",
      artId: "OP06-035_p3",
      setCode: "OP06",
      collectorNumber: "035",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-035_p3.jpg",
      label: "Hody Jones (Alternate Art)",
    },
    {
      id: "OP06-035_r1",
      artId: "OP06-035_r1",
      setCode: "OP06",
      collectorNumber: "035",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-035_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP06",
  cost: 7,
  power: 8000,
  traits: ["Fish-Man New Fish-Man Pirates"],
  attribute: "strike",

  effect:
    "[Rush] (This card can attack on the turn in which it is played.)\n[On Play] Rest up to a total of 2 of your opponent's Characters or DON!! cards. Then, add 1 card from the top of your Life cards to your hand.",
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
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: op06HodyJones035I18n,
};
