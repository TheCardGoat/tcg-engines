import type { EventCard } from "@tcg/op-types";
import { op09MyEraBegins096I18n } from "./096-my-era-begins.i18n.ts";

export const op09MyEraBegins096: EventCard = {
  id: "OP09-096",
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "OP09",
  cost: 1,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Blackbeard Pirates"],
  effect:
    '[Main] Look at 3 cards from the top of your deck; reveal up to 1 "Blackbeard Pirates" type card other than [My Era...Begins!!] and add it to your hand. Then, trash the rest.',
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "search",
            lookCount: 3,
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
                value: "My Era...Begins!!",
              },
              {
                filter: "trait",
                value: "Blackbeard Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
    ],
  },
  i18n: op09MyEraBegins096I18n,
};
