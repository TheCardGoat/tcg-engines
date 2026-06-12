import type { EventCard } from "@tcg/op-types";
import { op03AirDoor094I18n } from "./094-air-door.i18n.ts";

export const op03AirDoor094: EventCard = {
  id: "OP03-094",
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP03",
  cost: 4,
  traits: ["CP9"],
  effect:
    '[Main] If your Leader\'s type includes "CP", look at 5 cards from the top of your deck; play up to 1 Character card with a type including "CP" and a cost of 5 or less. Then, trash the rest. [Trigger] Play up to 1 black Character card with a cost of 3 or less from your trash.',
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "CP",
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
            revealDestination: "character",
            remainderPosition: "trash",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "color",
                value: "black",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op03AirDoor094I18n,
};
