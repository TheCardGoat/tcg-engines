import type { LeaderCard } from "@tcg/op-types";
import { eb02GeckoMoria080I18n } from "./080-gecko-moria.i18n.ts";

export const eb02GeckoMoria080: LeaderCard = {
  id: "OP06-080",
  cardType: "leader",
  color: ["black"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 5,
  traits: ["The Seven Warlords of the Sea Thriller Bark Pirates"],
  attribute: "special",
  effect:
    '[DON!! x1] [When Attacking] 2 (You may rest the specified number of DON!! cards in your cost area.) You may trash 1 card from your hand: Trash 2 cards from the top of your deck and play up to 1 "Thriller Bark Pirates" type Character card with a cost of 4 or less from your trash.',
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
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "trait",
                value: "Thriller Bark Pirates",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: eb02GeckoMoria080I18n,
};
