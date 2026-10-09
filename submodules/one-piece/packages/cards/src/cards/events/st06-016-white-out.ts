import type { EventCard } from "@tcg/op-types";
import { st06WhiteOut016I18n } from "./st06-016-white-out.i18n.ts";
export const st06WhiteOut016: EventCard = {
  id: "ST06-016",
  canonicalId: "ST06-016",
  slug: "white-out/st06-016",
  name: "White Out",
  printings: [
    {
      id: "ST06-016",
      artId: "ST06-016",
      setCode: "ST06",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST06-016.png",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "ST06",
  cost: 1,
  traits: ["Navy"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle.",
  trigger: "Draw 1 card and none of your Characters can be K.O.'d during this turn.",
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
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: st06WhiteOut016I18n,
};
