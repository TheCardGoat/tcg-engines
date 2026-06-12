import type { CharacterCard } from "@tcg/op-types";
import { op14eb04MonkeyDLuffyOp14013013I18n } from "./013-monkey-d-luffy-op14-013.i18n.ts";

export const op14eb04MonkeyDLuffyOp14013013: CharacterCard = {
  id: "OP14-013",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP14EB04",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-013_p1_0wTWlNh.jpg",
      imageId: "OP14-013_p1",
    },
  ],
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 {Supernovas} type card other than [Monkey.D.Luffy] and add it to your hand. Then, place the rest at the bottom of your deck in any order.\n[When Attacking] Give up to 1 of your opponent's Characters -1000 power during this turn.",
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
                value: "Monkey.D.Luffy",
              },
              {
                filter: "trait",
                value: "Supernovas",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op14eb04MonkeyDLuffyOp14013013I18n,
};
