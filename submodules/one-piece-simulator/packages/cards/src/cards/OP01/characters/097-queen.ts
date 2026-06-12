import type { CharacterCard } from "@tcg/op-types";
import { op01Queen097I18n } from "./097-queen.i18n.ts";

export const op01Queen097: CharacterCard = {
  id: "OP01-097",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP01",
  cost: 6,
  power: 5000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-097_p1.jpg",
      imageId: "OP01-097_p1",
    },
  ],
  effect:
    "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): This Character gains [Rush] during this turn. Then, give up to 1 of your opponent's Characters -2000 power during this turn. (This card can attack on the turn in which it is played.)  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
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
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op01Queen097I18n,
};
