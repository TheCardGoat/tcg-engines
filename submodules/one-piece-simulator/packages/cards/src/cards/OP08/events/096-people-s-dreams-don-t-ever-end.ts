import type { EventCard } from "@tcg/op-types";
import { op08PeopleSDreamsDonTEverEnd096I18n } from "./096-people-s-dreams-don-t-ever-end.i18n.ts";

export const op08PeopleSDreamsDonTEverEnd096: EventCard = {
  id: "OP08-096",
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP08",
  cost: 1,
  traits: ["Blackbeard Pirates"],
  effect:
    "[Counter] Trash 1 card from the top of your deck. If the trashed card has a cost of 6 or more, up to 1 of your Leader or Character cards gains +5000 power during this battle. [Trigger] Play up to 1 black Character card with a cost of 3 or less from your trash.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 1,
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
  i18n: op08PeopleSDreamsDonTEverEnd096I18n,
};
