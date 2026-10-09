import type { EventCard } from "@tcg/op-types";
import { st30AndYouGetYourselfInBigTrouble017I18n } from "./st30-017-and-you-get-yourself-in-big-trouble.i18n.ts";
export const st30AndYouGetYourselfInBigTrouble017: EventCard = {
  id: "ST30-017",
  canonicalId: "ST30-017",
  slug: "and-you-get-yourself-in-big-trouble/st30-017",
  name: "And You Get Yourself in Big Trouble!!",
  printings: [
    {
      id: "ST30-017",
      artId: "ST30-017",
      setCode: "ST30",
      collectorNumber: "017",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST30-017.png",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "ST30",
  cost: 1,
  traits: ["Whitebeard Pirates"],
  effect:
    "[Main] Look at 5 cards from the top of your deck; reveal up to 1 Character card with 6000 power and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  trigger: "Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
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
                filter: "power",
                comparison: "eq",
                value: 6000,
              },
              {
                filter: "cardCategory",
                value: "character",
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
  i18n: st30AndYouGetYourselfInBigTrouble017I18n,
};
