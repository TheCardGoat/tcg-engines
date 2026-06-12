import type { CharacterCard } from "@tcg/op-types";
import { prb01Kaido003I18n } from "./003-kaido.i18n.ts";

export const prb01Kaido003: CharacterCard = {
  id: "ST04-003",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "PRB01",
  cost: 9,
  power: 10000,
  traits: ["The Four Emperors", "Animal Kingdom Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-003_p4.jpg",
      imageId: "ST04-003_p4",
    },
  ],
  effect:
    "[On Play] DON!! -5 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 1 of your opponent's Characters with a cost of 6 or less. This Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 5,
          },
        ],
        actions: [
          {
            action: "ko",
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
                  value: 6,
                },
              ],
            },
          },
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: prb01Kaido003I18n,
};
