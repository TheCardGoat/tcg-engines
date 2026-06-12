import type { LeaderCard } from "@tcg/op-types";
import { op10Sugar003I18n } from "./003-sugar.i18n.ts";

export const op10Sugar003: LeaderCard = {
  id: "OP10-003",
  cardType: "leader",
  color: ["purple", "red"],
  rarity: "L",
  setId: "OP10",
  power: 5000,
  life: 4,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-003_p1.jpg",
      imageId: "OP10-003_p1",
    },
  ],
  effect:
    "[End of Your Turn] If you have a {Donquixote Pirates} type Character with 6000 power or more, set up to 1 of your DON!! cards as active.[Opponent's Turn] [Once Per Turn] When you activate an Event, add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "trait",
                value: "Donquixote Pirates",
              },
              {
                filter: "power",
                comparison: "gte",
                value: 6000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
      {
        trigger: "whenYouActivateEvent",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op10Sugar003I18n,
};
