import type { CharacterCard } from "@tcg/op-types";
import { op12Tashigi031I18n } from "./031-tashigi.i18n.ts";

export const op12Tashigi031: CharacterCard = {
  id: "OP12-031",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP12",
  cost: 5,
  power: 7000,
  traits: ["Navy East Blue"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-031_p1_zrAdWKE.jpg",
      imageId: "OP12-031_p1",
    },
  ],
  effect:
    "[On Play] Rest up to 1 of your opponent's Characters with a base cost of 6 or less. Then, give up to 3 rested DON!! cards to your [Roronoa Zoro] Leader.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "baseCost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
          },
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "name",
                  value: "Roronoa Zoro",
                },
              ],
            },
            count: {
              amount: 3,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op12Tashigi031I18n,
};
