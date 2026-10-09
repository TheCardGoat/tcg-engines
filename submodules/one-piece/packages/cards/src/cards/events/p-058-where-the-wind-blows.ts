import type { EventCard } from "@tcg/op-types";
import { pWhereTheWindBlows058I18n } from "./p-058-where-the-wind-blows.i18n.ts";
export const pWhereTheWindBlows058: EventCard = {
  id: "P-058",
  canonicalId: "P-058",
  slug: "where-the-wind-blows/p-058",
  name: "Where the Wind Blows",
  printings: [
    {
      id: "P-058",
      artId: "P-058",
      setCode: "P",
      collectorNumber: "058",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-058.png",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 2,
  traits: ["Music", "FILM"],
  effect:
    "[Main] If your Leader is [Uta], set all of your {FILM} type Characters as active at the end of this turn.",
  trigger: "Set all of your {FILM} type Characters as active.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderName",
            name: "Uta",
          },
        ],
        actions: [
          {
            action: "delayed",
            timing: "endOfThisTurn",
            actions: [
              {
                action: "setActive",
                target: {
                  player: "self",
                  zones: ["character"],
                  count: {
                    amount: "all",
                  },
                  filters: [
                    {
                      filter: "trait",
                      value: "FILM",
                      match: "exact",
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "FILM",
                  match: "exact",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: pWhereTheWindBlows058I18n,
};
