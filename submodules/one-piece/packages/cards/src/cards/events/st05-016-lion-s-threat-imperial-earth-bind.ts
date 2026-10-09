import type { EventCard } from "@tcg/op-types";
import { st05LionsThreatImperialEarthBind016I18n } from "./st05-016-lion-s-threat-imperial-earth-bind.i18n.ts";

export const st05LionsThreatImperialEarthBind016: EventCard = {
  id: "ST05-016",
  canonicalId: "ST05-016",
  slug: "lion-s-threat-imperial-earth-bind/st05-016",
  name: "Lion's Threat Imperial Earth Bind",
  printings: [
    {
      id: "ST05-016",
      artId: "ST05-016",
      setCode: "ST05",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST05-016.png",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "ST05",
  cost: 3,
  traits: ["FILM", "Golden Lion Pirates"],
  effect:
    "[Main] DON!! −2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
  trigger: "Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "main",
        optional: true,
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
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
          },
        ],
      },
      {
        trigger: "trigger",
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
      },
    ],
  },
  i18n: st05LionsThreatImperialEarthBind016I18n,
};
