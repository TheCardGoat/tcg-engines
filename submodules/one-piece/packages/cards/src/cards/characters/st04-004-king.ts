import type { CharacterCard } from "@tcg/op-types";
import { st04King004I18n } from "./st04-004-king.i18n.ts";

export const st04King004: CharacterCard = {
  id: "ST04-004",
  canonicalId: "ST04-004",
  slug: "king/st04-004",
  name: "King",
  printings: [
    {
      id: "ST04-004",
      artId: "ST04-004",
      setCode: "ST04",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST04-004.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "ST04",
  cost: 6,
  traits: ["Animal Kingdom Pirates"],
  power: 7000,
  attribute: "special",
  counter: 0,
  effect:
    "[On Play] DON!! −1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        optional: true,
        costs: [
          {
            cost: "returnDon",
            amount: 1,
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st04King004I18n,
};
