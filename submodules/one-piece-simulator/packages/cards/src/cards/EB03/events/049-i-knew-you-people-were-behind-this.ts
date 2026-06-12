import type { EventCard } from "@tcg/op-types";
import { eb03IKnewYouPeopleWereBehindThis049I18n } from "./049-i-knew-you-people-were-behind-this.i18n.ts";

export const eb03IKnewYouPeopleWereBehindThis049: EventCard = {
  id: "EB03-049",
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "EB03",
  cost: 1,
  traits: ["Thriller Bark Pirates"],
  effect:
    "[Main] You may rest 7 of your DON!! cards: If your Leader is [Perona], play up to 1 {Thriller Bark Pirates} type Character card with a cost of 6 or less and up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your hand or trash. [Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderName",
            name: "Perona",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: ["hand", "trash"],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 6,
              },
              {
                filter: "trait",
                value: "Thriller Bark Pirates",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: ["hand", "trash"],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "trait",
                value: "Thriller Bark Pirates",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: eb03IKnewYouPeopleWereBehindThis049I18n,
};
