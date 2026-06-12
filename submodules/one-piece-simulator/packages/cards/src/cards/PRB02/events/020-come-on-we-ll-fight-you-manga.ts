import type { EventCard } from "@tcg/op-types";
import { prb02ComeOnWeLlFightYouManga020I18n } from "./020-come-on-we-ll-fight-you-manga.i18n.ts";

export const prb02ComeOnWeLlFightYouManga020: EventCard = {
  id: "OP09-020",
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "PRB02",
  cost: 1,
  traits: ["The Four Emperors Red-Haired Pirates"],
  effect:
    '[Main] Look at 5 cards from the top of your deck; reveal up to 1 "Red-Haired Pirates" type card other than [Come On!! We\'ll Fight You!!] and add it to your hand. Then, place the rest at the bottom of your deck in any order.[Trigger] Draw 1 card.',
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
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: prb02ComeOnWeLlFightYouManga020I18n,
};
