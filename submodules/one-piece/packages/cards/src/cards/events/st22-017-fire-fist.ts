import type { EventCard } from "@tcg/op-types";
import { st22FireFist017I18n } from "./st22-017-fire-fist.i18n.ts";
export const st22FireFist017: EventCard = {
  id: "ST22-017",
  canonicalId: "ST22-017",
  slug: "fire-fist/st22-017",
  name: "Fire Fist",
  printings: [
    {
      id: "ST22-017",
      artId: "ST22-017",
      setCode: "ST22",
      collectorNumber: "017",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST22-017.png",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "ST22",
  cost: 5,
  traits: ["Whitebeard Pirates"],
  effect:
    '[Main] You may reveal 2 cards with a type including "Whitebeard Pirates" from your hand: Draw 1 card. Then, place up to 1 Character with a cost of 5 or less at the bottom of the owner\'s deck.',
  trigger: "Return up to 1 Character with a cost of 3 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "revealFromHand",
            amount: 2,
            filters: [
              {
                filter: "trait",
                value: "Whitebeard Pirates",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "returnToDeck",
            target: {
              player: "any",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
            position: "bottom",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "any",
              zones: ["character"],
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
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st22FireFist017I18n,
};
