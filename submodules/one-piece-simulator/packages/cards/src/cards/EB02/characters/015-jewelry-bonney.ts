import type { CharacterCard } from "@tcg/op-types";
import { eb02JewelryBonney015I18n } from "./015-jewelry-bonney.i18n.ts";

export const eb02JewelryBonney015: CharacterCard = {
  id: "EB02-015",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "EB02",
  cost: 7,
  power: 7000,
  counter: 1000,
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-015_p1.png",
      imageId: "EB02-015_p1",
    },
  ],
  effect:
    "[On Play] Up to 1 of your opponent's rested Characters will not become active in your opponent's next Refresh Phase. Then, set up to 1 of your DON!! cards as active at the end of this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
          },
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: eb02JewelryBonney015I18n,
};
