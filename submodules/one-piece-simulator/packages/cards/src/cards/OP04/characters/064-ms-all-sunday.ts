import type { CharacterCard } from "@tcg/op-types";
import { op04MsAllSunday064I18n } from "./064-ms-all-sunday.i18n.ts";

export const op04MsAllSunday064: CharacterCard = {
  id: "OP04-064",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP04",
  cost: 5,
  power: 5000,
  traits: ["Baroque Works"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-064_p1.jpg",
      imageId: "OP04-064_p1",
    },
  ],
  effect:
    "[On Play] Add up to 1 DON!! card from your DON!! deck and rest it. Then, if you have 6 or more DON!! cards on your field, draw 1 card. [Trigger] DON!! -2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op04MsAllSunday064I18n,
};
