import type { EventCard } from "@tcg/op-types";
import { st11NewGenesis004I18n } from "./st11-004-new-genesis.i18n.ts";
export const st11NewGenesis004: EventCard = {
  id: "ST11-004",
  canonicalId: "ST11-004",
  slug: "new-genesis/st11-004",
  name: "New Genesis",
  printings: [
    {
      id: "ST11-004",
      artId: "ST11-004",
      setCode: "ST11",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST11-004.png",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "SR",
  setId: "ST11",
  traits: ["Music", "FILM"],
  cost: 1,
  effect:
    "[Main] If your Leader is [Uta], look at 3 cards from the top of your deck; reveal up to 1 {FILM} type card other than [New Genesis] and add it to your hand. Then, place the rest at the bottom of your deck in any order and set up to 1 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderName",
            name: "Uta",
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 3,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "excludeName",
                value: "New Genesis",
              },
              {
                filter: "trait",
                value: "FILM",
                match: "exact",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: st11NewGenesis004I18n,
};
