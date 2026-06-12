import type { LeaderCard } from "@tcg/op-types";
import { op09Buggy042I18n } from "./042-buggy.i18n.ts";

export const op09Buggy042: LeaderCard = {
  id: "OP09-042",
  cardType: "leader",
  color: ["blue"],
  rarity: "L",
  setId: "OP09",
  power: 5000,
  life: 5,
  traits: ["The Four Emperors Cross Guild"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-042_p1.jpg",
      imageId: "OP09-042_p1",
    },
  ],
  effect:
    '[Activate: Main] You may rest 5 of your DON!! cards and trash 1 card from your hand: Play up to 1 "Cross Guild" type Character card from your hand.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 5,
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
                filter: "trait",
                value: "Cross Guild",
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
  i18n: op09Buggy042I18n,
};
