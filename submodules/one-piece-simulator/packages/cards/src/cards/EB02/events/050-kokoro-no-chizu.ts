import type { EventCard } from "@tcg/op-types";
import { eb02KokoroNoChizu050I18n } from "./050-kokoro-no-chizu.i18n.ts";

export const eb02KokoroNoChizu050: EventCard = {
  id: "EB02-050",
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "EB02",
  cost: 2,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Music"],
  effect:
    "[Main] Look at 4 cards from the top of your deck; reveal up to 1 card with a cost of 4 or more and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "search",
            lookCount: 4,
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
                filter: "cost",
                comparison: "gte",
                value: 4,
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: eb02KokoroNoChizu050I18n,
};
