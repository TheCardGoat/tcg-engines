import type { EventCard } from "@tcg/op-types";
import { op09ComeOnWeLlFightYou020I18n } from "./020-come-on-we-ll-fight-you.i18n.ts";

export const op09ComeOnWeLlFightYou020: EventCard = {
  id: "OP09-020",
  canonicalId: "OP09-020",
  slug: "come-on-we-ll-fight-you",
  name: "Come On!! We'll Fight You!!",
  printings: [
    {
      id: "OP09-020",
      artId: "OP09-020",
      setCode: "OP09",
      collectorNumber: "020",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-020.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP09",
  cost: 1,
  trigger: "Draw 1 card.",
  traits: ["The Four Emperors Red-Haired Pirates"],
  effect:
    '[Main] Look at 5 cards from the top of your deck; reveal up to 1 "Red-Haired Pirates" type card other than [Come On!! We\'ll Fight You!!] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                filter: "excludeName",
                value: "Come On!! We'll Fight You!!",
              },
              {
                filter: "trait",
                value: "Red-Haired Pirates",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    ],
  },
  i18n: op09ComeOnWeLlFightYou020I18n,
};
