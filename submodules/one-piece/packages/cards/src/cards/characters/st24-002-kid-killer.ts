import type { CharacterCard } from "@tcg/op-types";
import { st24KidKiller002I18n } from "./st24-002-kid-killer.i18n.ts";
export const st24KidKiller002: CharacterCard = {
  id: "ST24-002",
  canonicalId: "ST24-002",
  slug: "kid-killer/st24-002",
  name: "Kid & Killer",
  printings: [
    {
      id: "ST24-002",
      artId: "ST24-002",
      setCode: "ST24",
      collectorNumber: "002",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST24-002.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "ST24",
  cost: 2,
  traits: ["Supernovas", "Kid Pirates"],
  power: 2000,
  attribute: ["slash", "special"],
  counter: 1000,
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 {Supernovas} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order. [On Your Opponent's Attack] You may trash this Character: Set up to 1 of your DON!! cards as active.",
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
                filter: "trait",
                value: "Supernovas",
                match: "exact",
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
        optional: true,
      },
    ],
  },
  i18n: st24KidKiller002I18n,
};
