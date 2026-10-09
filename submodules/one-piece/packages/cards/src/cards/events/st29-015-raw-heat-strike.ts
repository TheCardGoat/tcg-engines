import type { EventCard } from "@tcg/op-types";
import { st29RawHeatStrike015I18n } from "./st29-015-raw-heat-strike.i18n.ts";
export const st29RawHeatStrike015: EventCard = {
  id: "ST29-015",
  canonicalId: "ST29-015",
  slug: "raw-heat-strike/st29-015",
  name: "Raw Heat Strike",
  printings: [
    {
      id: "ST29-015",
      artId: "ST29-015",
      setCode: "ST29",
      collectorNumber: "015",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST29-015.png",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "ST29",
  cost: 1,
  traits: ["Egghead", "Straw Hat Crew"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if you have 1 or less Life cards, give up to 1 of your opponent's Leader or Character cards −2000 power during this turn.",
  trigger: "Draw 1 card.",
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
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
            condition: {
              condition: "lifeCount",
              player: "self",
              comparison: "lte",
              value: 1,
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: st29RawHeatStrike015I18n,
};
