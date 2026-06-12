import type { EventCard } from "@tcg/op-types";
import { op11LetSCrashThisWedding060I18n } from "./060-let-s-crash-this-wedding.i18n.ts";

export const op11LetSCrashThisWedding060: EventCard = {
  id: "OP11-060",
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "OP11",
  cost: 1,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Straw Hat Crew"],
  effect:
    '[Main] If your Leader is multicolored, look at 5 cards from the top of your deck; reveal up to 1 "Straw Hat Crew" type card other than [Let\'s Crash This Wedding!!!] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderMulticolored",
          },
        ],
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
                value: "Let's Crash This Wedding!!!",
              },
              {
                filter: "trait",
                value: "Straw Hat Crew",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op11LetSCrashThisWedding060I18n,
};
