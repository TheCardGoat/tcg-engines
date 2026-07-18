import type { EventCard } from "@tcg/op-types";
import { op14eb04PleaseTakeMeWithYouICanBeOfGreatHelpToYou059I18n } from "./059-please-take-me-with-you-i-can-be-of-great-help-to-you.i18n.ts";

export const op14eb04PleaseTakeMeWithYouICanBeOfGreatHelpToYou059: EventCard = {
  id: "OP14-059",
  canonicalId: "OP14-059",
  slug: "please-take-me-with-you-i-can-be-of-great-help-to-you",
  name: "Please Take Me with You!! I Can Be of Great Help to You!!",
  printings: [
    {
      id: "OP14-059",
      artId: "OP14-059",
      setCode: "OP14EB04",
      collectorNumber: "059",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-059_APXktng.jpg",
    },
  ],
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
      {
        trigger: "trigger",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "both",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "cost", comparison: "lte", value: 4 }],
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04PleaseTakeMeWithYouICanBeOfGreatHelpToYou059I18n,
};
