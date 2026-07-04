import type { CharacterCard } from "@tcg/op-types";
import { op12LimSp037I18n } from "./037-lim-sp.i18n.ts";

export const op12LimSp037: CharacterCard = {
  id: "OP09-037",
  canonicalId: "OP09-037",
  slug: "lim-sp",
  name: "Lim (SP)",
  printings: [
    {
      id: "OP09-037",
      artId: "OP09-037",
      setCode: "OP12",
      collectorNumber: "037",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-037_p2_9ZL08cD.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP12",
  cost: 3,
  power: 5000,
  traits: ["ODYSSEY"],
  attribute: "wisdom",
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 "ODYSSEY" type card other than [Lim] and add it to your hand. Then, place the rest at the bottom of your deck in any order.\n[End of Your Turn] If you have 3 or more rested Characters, set this Character as active.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 5,
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
                value: "Lim",
              },
              {
                filter: "trait",
                value: "ODYSSEY",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 3,
            filters: [
              {
                filter: "state",
                value: "rested",
              },
            ],
          },
        ],
        actions: [
          {
            action: "setActive",
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
      },
    ],
  },
  i18n: op12LimSp037I18n,
};
