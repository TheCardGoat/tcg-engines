import type { CharacterCard } from "@tcg/op-types";
import { op12MonkeyDGarp056I18n } from "./056-monkey-d-garp.i18n.ts";

export const op12MonkeyDGarp056: CharacterCard = {
  id: "OP12-056",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP12",
  cost: 8,
  power: 8000,
  traits: ["Navy"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-056_p1_Mtb3fJc.jpg",
      imageId: "OP12-056_p1",
    },
  ],
  effect:
    '[On Play] You may trash 1 card from your hand: Play up to 1 blue "Navy" type Character card with 8000 power or less other than [Monkey.D.Garp] from your hand.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "excludeName",
                value: "Monkey.D.Garp",
              },
              {
                filter: "power",
                comparison: "lte",
                value: 8000,
              },
              {
                filter: "color",
                value: "blue",
              },
              {
                filter: "trait",
                value: "Navy",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op12MonkeyDGarp056I18n,
};
