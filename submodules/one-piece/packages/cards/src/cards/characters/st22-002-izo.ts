import type { CharacterCard } from "@tcg/op-types";
import { st22Izo002I18n } from "./st22-002-izo.i18n.ts";
export const st22Izo002: CharacterCard = {
  id: "ST22-002",
  canonicalId: "ST22-002",
  slug: "izo/st22-002",
  name: "Izo",
  printings: [
    {
      id: "ST22-002",
      artId: "ST22-002",
      setCode: "ST22",
      collectorNumber: "002",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST22-002.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "ST22",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Land of Wano", "Whitebeard Pirates"],
  attribute: "ranged",
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 card with a type including "Whitebeard Pirates" other than [Izo] and add it to your hand. Then, place the rest at the bottom of your deck in any order. [On Your Opponent\'s Attack] You may trash this Character: Draw 1 card and place 1 card from your hand at the bottom of your deck.',
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
                value: "Izo",
              },
              {
                filter: "trait",
                value: "Whitebeard Pirates",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
              },
            },
            position: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st22Izo002I18n,
};
