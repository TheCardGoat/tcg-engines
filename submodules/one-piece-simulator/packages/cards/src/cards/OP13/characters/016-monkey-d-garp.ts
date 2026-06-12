import type { CharacterCard } from "@tcg/op-types";
import { op13MonkeyDGarp016I18n } from "./016-monkey-d-garp.i18n.ts";

export const op13MonkeyDGarp016: CharacterCard = {
  id: "OP13-016",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP13",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-016_p1_OvF5vix.jpg",
      imageId: "OP13-016_p1",
    },
  ],
  effect:
    "[On Play] If your Leader is [Sabo], [Portgas.D.Ace] or [Monkey.D.Luffy], look at 4 cards from the top of your deck; reveal up to 1 card with a cost of 3 or more and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "leaderName",
                name: "Sabo",
              },
              {
                condition: "leaderName",
                name: "Portgas.D.Ace",
              },
              {
                condition: "leaderName",
                name: "Monkey.D.Luffy",
              },
            ],
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 4,
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
                filter: "cost",
                comparison: "gte",
                value: 3,
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op13MonkeyDGarp016I18n,
};
