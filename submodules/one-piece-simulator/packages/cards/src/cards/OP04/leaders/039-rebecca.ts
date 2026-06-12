import type { LeaderCard } from "@tcg/op-types";
import { op04Rebecca039I18n } from "./039-rebecca.i18n.ts";

export const op04Rebecca039: LeaderCard = {
  id: "OP04-039",
  cardType: "leader",
  color: ["blue", "black"],
  rarity: "L",
  setId: "OP04",
  power: 5000,
  life: 5,
  traits: ["Dressrosa"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-039_p1.jpg",
      imageId: "OP04-039_p1",
    },
  ],
  effect:
    "This Leader cannot attack. [Activate:Main] [Once Per Turn] (1) (You may rest the specified number of DON!! cards in your cost area.): If you have 6 or less cards in your hand, look at 2 cards from the top of your deck; reveal up to 1 [Dressrosa] type card and add it to your hand. Then, trash the rest.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 6,
          },
        ],
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 2,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "trait",
                value: "Dressrosa",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op04Rebecca039I18n,
};
