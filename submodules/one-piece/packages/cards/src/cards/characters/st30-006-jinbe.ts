import type { CharacterCard } from "@tcg/op-types";
import { st30Jinbe006I18n } from "./st30-006-jinbe.i18n.ts";
export const st30Jinbe006: CharacterCard = {
  id: "ST30-006",
  canonicalId: "ST30-006",
  slug: "jinbe/st30-006",
  name: "Jinbe",
  printings: [
    {
      id: "ST30-006",
      artId: "ST30-006",
      setCode: "ST30",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST30-006.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST30",
  cost: 5,
  traits: ["Fish-Man", "Impel Down", "The Sun Pirates"],
  power: 6000,
  attribute: "strike",
  counter: 1000,
  effect: "[On Play] You may trash 1 Character card with 6000 power from your hand: Draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "power",
                comparison: "eq",
                value: 6000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st30Jinbe006I18n,
};
