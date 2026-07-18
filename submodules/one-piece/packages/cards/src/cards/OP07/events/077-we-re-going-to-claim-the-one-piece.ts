import type { EventCard } from "@tcg/op-types";
import { op07WeReGoingToClaimTheOnePiece077I18n } from "./077-we-re-going-to-claim-the-one-piece.i18n.ts";

export const op07WeReGoingToClaimTheOnePiece077: EventCard = {
  id: "OP07-077",
  canonicalId: "OP07-077",
  slug: "we-re-going-to-claim-the-one-piece",
  name: "We're Going to Claim the One Piece!!!",
  printings: [
    {
      id: "OP07-077",
      artId: "OP07-077",
      setCode: "OP07",
      collectorNumber: "077",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-077.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP07",
  cost: 1,
  traits: ["Land of Wano The Four Emperors"],
  effect:
    "[Main] If your Leader has the [Animal Kingdom Pirates] or [Big Mom Pirates] type, look at 5 cards from the top of your deck; reveal up to 1 [Animal Kingdom Pirates] or [Big Mom Pirates] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Animal Kingdom Pirates",
                match: "includes",
              },
              {
                condition: "leaderTrait",
                trait: "Big Mom Pirates",
                match: "includes",
              },
            ],
          },
        ],
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
                filter: "anyOf",
                filters: [
                  {
                    filter: "trait",
                    value: "Animal Kingdom Pirates",
                    match: "includes",
                  },
                  {
                    filter: "trait",
                    value: "Big Mom Pirates",
                    match: "includes",
                  },
                ],
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: op07WeReGoingToClaimTheOnePiece077I18n,
};
