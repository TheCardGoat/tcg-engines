import type { EventCard } from "@tcg/op-types";
import { op14eb04PleaseTakeMeWithYouICanBeOfGreatHelpToYou059I18n } from "./059-please-take-me-with-you-i-can-be-of-great-help-to-you.i18n.ts";

export const op14eb04PleaseTakeMeWithYouICanBeOfGreatHelpToYou059: EventCard = {
  id: "OP14-059",
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 1,
  trigger: "Return up to 1 Character with a cost of 4 or less to the owner's hand.",
  traits: ["Fish-Man The Seven Warlords of the Sea The Sun Pirates"],
  effect:
    "[Main] If your Leader is [Jinbe] and you have 2 or less cards in your hand, draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderName",
                name: "Jinbe",
              },
              {
                condition: "handCount",
                player: "self",
                comparison: "lte",
                value: 2,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op14eb04PleaseTakeMeWithYouICanBeOfGreatHelpToYou059I18n,
};
