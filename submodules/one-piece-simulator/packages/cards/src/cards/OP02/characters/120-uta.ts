import type { CharacterCard } from "@tcg/op-types";
import { op02Uta120I18n } from "./120-uta.i18n.ts";

export const op02Uta120: CharacterCard = {
  id: "OP02-120",
  cardType: "character",
  color: ["purple"],
  rarity: "SEC",
  setId: "OP02",
  cost: 8,
  power: 8000,
  traits: ["FILM"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-120_p1.jpg",
      imageId: "OP02-120_p1",
    },
  ],
  effect:
    "[On Play] DON!! -2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Your Leader and all of your Characters gain +1000 power until the start of your next turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: "all",
              },
            },
            value: 1000,
            duration: "untilStartOfNextTurn",
          },
        ],
      },
    ],
  },
  i18n: op02Uta120I18n,
};
