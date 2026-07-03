import type { CharacterCard } from "@tcg/op-types";
import { op08CharlottePerospero068I18n } from "./068-charlotte-perospero.i18n.ts";

export const op08CharlottePerospero068: CharacterCard = {
  id: "OP08-068",
  canonicalId: "OP08-068",
  slug: "charlotte-perospero/op08-068",
  name: "Charlotte Perospero",
  printings: [
    {
      id: "OP08-068",
      artId: "OP08-068",
      setCode: "OP08",
      collectorNumber: "068",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-068.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP08",
  cost: 3,
  power: 5000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[On K.O.] Add up to 1 DON!! card from your DON!! deck and rest it. [Trigger] DON!! 1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play this card.",
  effects: {
    effects: [
      {
        trigger: "onKo",
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
            amount: 1,
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
  i18n: op08CharlottePerospero068I18n,
};
