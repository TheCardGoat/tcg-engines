import type { CharacterCard } from "@tcg/op-types";
import { st04Ulti002I18n } from "./st04-002-ulti.i18n.ts";

export const st04Ulti002: CharacterCard = {
  id: "ST04-002",
  canonicalId: "ST04-002",
  slug: "ulti/st04-002",
  name: "Ulti",
  printings: [
    {
      id: "ST04-002",
      artId: "ST04-002",
      setCode: "ST04",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST04-002.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST04",
  cost: 4,
  traits: ["Animal Kingdom Pirates"],
  power: 5000,
  attribute: "strike",
  counter: 2000,
  effect:
    "[On Play] DON!! −1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play up to 1 [Page One] card with a cost of 4 or less from your hand.",
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
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Page One",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: st04Ulti002I18n,
};
