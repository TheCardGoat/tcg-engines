import type { CharacterCard } from "@tcg/op-types";
import { st05BuenaFesta014I18n } from "./st05-014-buena-festa.i18n.ts";

export const st05BuenaFesta014: CharacterCard = {
  id: "ST05-014",
  canonicalId: "ST05-014",
  slug: "buena-festa/st05-014",
  name: "Buena Festa",
  printings: [
    {
      id: "ST05-014",
      artId: "ST05-014",
      setCode: "ST05",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST05-014.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST05",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["FILM", "The Pirates Fest"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 {FILM} type card other than [Buena Festa] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Buena Festa",
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
        ],
      },
    ],
  },
  i18n: st05BuenaFesta014I18n,
};
