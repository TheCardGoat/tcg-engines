import type { EventCard } from "@tcg/op-types";
import { op10IDoNotForgiveThoseWhoLaughAtMyFamily078I18n } from "./078-i-do-not-forgive-those-who-laugh-at-my-family.i18n.ts";

export const op10IDoNotForgiveThoseWhoLaughAtMyFamily078: EventCard = {
  id: "OP10-078",
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP10",
  cost: 1,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  effect:
    '[Main]/[Counter] Look at 3 cards from the top of your deck; reveal up to 1 "Donquixote Pirates" type card other than [I Do Not Forgive Those Who Laugh at My Family!!!] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                value: "I Do Not Forgive Those Who Laugh at My Family!!!",
              },
              {
                filter: "trait",
                value: "Donquixote Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "counter",
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
                value: "I Do Not Forgive Those Who Laugh at My Family!!!",
              },
              {
                filter: "trait",
                value: "Donquixote Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op10IDoNotForgiveThoseWhoLaughAtMyFamily078I18n,
};
