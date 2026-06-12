import type { CharacterCard } from "@tcg/op-types";
import { op04WhoSWho051I18n } from "./051-who-s-who.i18n.ts";

export const op04WhoSWho051: CharacterCard = {
  id: "OP04-051",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP04",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-051_p1.jpg",
      imageId: "OP04-051_p1",
    },
  ],
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Animal Kingdom Pirates] type card other than [Who's.Who] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Who's.Who",
              },
              {
                filter: "trait",
                value: "Animal Kingdom Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op04WhoSWho051I18n,
};
