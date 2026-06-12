import type { CharacterCard } from "@tcg/op-types";
import { op04Mr5Gem072I18n } from "./072-mr-5-gem.i18n.ts";

export const op04Mr5Gem072: CharacterCard = {
  id: "OP04-072",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP04",
  cost: 7,
  power: 8000,
  traits: ["Baroque Works"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-072_p1.jpg",
      imageId: "OP04-072_p1",
    },
  ],
  effect:
    "[On Your Opponent's Attack] [Once Per Turn] DON!! -2 (You may return the specified number of DON!! cards from your field to your DON!! deck.) You may rest this Character: K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
          {
            cost: "restThisCard",
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
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op04Mr5Gem072I18n,
};
