import type { CharacterCard } from "@tcg/op-types";
import { eb02Arlong011I18n } from "./011-arlong.i18n.ts";

export const eb02Arlong011: CharacterCard = {
  id: "EB02-011",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "EB02",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Fish-Man Arlong Pirates East Blue"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-011_p1.png",
      imageId: "EB02-011_p1",
    },
  ],
  effect:
    '[On Play] If your Leader has the "Fish-Man" or "East Blue" type, give up to 1 rested DON!! card to 1 of your Leader. Then, up to 1 of your opponent\'s Characters with a cost of 5 or less cannot be rested until the end of your opponent\'s next turn.',
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
                condition: "leaderTrait",
                trait: "Fish-Man",
              },
              {
                condition: "leaderTrait",
                trait: "East Blue",
              },
            ],
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
          {
            action: "cannotBeRested",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
    ],
  },
  i18n: eb02Arlong011I18n,
};
