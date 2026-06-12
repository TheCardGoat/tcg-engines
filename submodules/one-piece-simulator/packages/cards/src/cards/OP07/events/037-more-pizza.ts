import type { EventCard } from "@tcg/op-types";
import { op07MorePizza037I18n } from "./037-more-pizza.i18n.ts";

export const op07MorePizza037: EventCard = {
  id: "OP07-037",
  cardType: "event",
  color: ["green"],
  rarity: "UC",
  setId: "OP07",
  cost: 1,
  traits: ["Bonney Pirates Supernovas"],
  effect:
    "[Main] Look at 5 cards from the top of your deck; reveal up to 1 [Supernovas] type card other than [More Pizza!!] and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] Draw 1 card.",
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
                value: "More Pizza!!",
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
  i18n: op07MorePizza037I18n,
};
