import type { EventCard } from "@tcg/op-types";
import { op06ButIWillNeverDoubtAWomanSTears057I18n } from "./057-but-i-will-never-doubt-a-woman-s-tears.i18n.ts";

export const op06ButIWillNeverDoubtAWomanSTears057: EventCard = {
  id: "OP06-057",
  canonicalId: "OP06-057",
  slug: "but-i-will-never-doubt-a-woman-s-tears",
  name: "But I Will Never Doubt a Woman's Tears!!!!",
  printings: [
    {
      id: "OP06-057",
      artId: "OP06-057",
      setCode: "OP06",
      collectorNumber: "057",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-057.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP06",
  cost: 1,
  trigger: "Play up to 1 Character card with a cost of 2 from your hand.",
  traits: ["Straw Hat Crew Dressrosa"],
  effect:
    "[Main] Up to 1 of your Leader or Character cards gains +1000 power during this turn. Then, reveal 1 card from the top of your deck, play up to 1 Character card with a cost of 2, and place the rest at the top or bottom of your deck.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
          {
            action: "revealTopDeckCard",
            player: "self",
            conditional: {
              filters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "cost",
                  comparison: "eq",
                  value: 2,
                },
              ],
              actions: [
                {
                  action: "play",
                  source: {
                    player: "self",
                    zone: "deck",
                  },
                  count: {
                    amount: 1,
                    upTo: true,
                  },
                  filters: [
                    {
                      filter: "cardCategory",
                      value: "character",
                    },
                    {
                      filter: "cost",
                      comparison: "eq",
                      value: 2,
                    },
                  ],
                  topOnly: true,
                },
              ],
            },
            finalPosition: "choice",
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
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 2,
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
  i18n: op06ButIWillNeverDoubtAWomanSTears057I18n,
};
