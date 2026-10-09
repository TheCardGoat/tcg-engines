import type { EventCard } from "@tcg/op-types";
import { st02Scalpel015I18n } from "./st02-015-scalpel.i18n.ts";
export const st02Scalpel015: EventCard = {
  id: "ST02-015",
  canonicalId: "ST02-015",
  slug: "scalpel/st02-015",
  name: "Scalpel",
  printings: [
    {
      id: "ST02-015",
      artId: "ST02-015",
      setCode: "ST02",
      collectorNumber: "015",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST02-015.png",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "ST02",
  cost: 1,
  traits: ["Supernovas", "Heart Pirates"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, set up to 1 of your DON!! cards as active.",
  trigger: "Set up to 2 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "counter",
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
            value: 2000,
            duration: "thisBattle",
          },
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
        trigger: "trigger",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: st02Scalpel015I18n,
};
