import type { CharacterCard } from "@tcg/op-types";
import { op04Sugar024I18n } from "./024-sugar.i18n.ts";

export const op04Sugar024: CharacterCard = {
  id: "OP04-024",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP04",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-024_p1.jpg",
      imageId: "OP04-024_p1",
    },
  ],
  effect:
    "[Opponent's Turn] [Once Per Turn] When your opponent plays a Character, if your Leader has the [Donquixote Pirates] type, rest up to 1 of your opponent's Characters. Then, rest this Character. [On Play] Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
          {
            action: "rest",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        oncePerTurn: true,
      },
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
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
  i18n: op04Sugar024I18n,
};
