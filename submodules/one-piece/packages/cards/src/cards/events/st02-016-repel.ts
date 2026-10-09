import type { EventCard } from "@tcg/op-types";
import { st02Repel016I18n } from "./st02-016-repel.i18n.ts";
export const st02Repel016: EventCard = {
  id: "ST02-016",
  canonicalId: "ST02-016",
  slug: "repel/st02-016",
  name: "Repel",
  printings: [
    {
      id: "ST02-016",
      artId: "ST02-016",
      setCode: "ST02",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST02-016.png",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "ST02",
  cost: 2,
  traits: ["Supernovas", "Kid Pirates"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, set up to 1 of your DON!! cards as active.",
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
            value: 4000,
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
    ],
  },
  i18n: st02Repel016I18n,
};
