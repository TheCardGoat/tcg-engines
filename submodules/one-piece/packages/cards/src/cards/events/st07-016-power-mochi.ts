import type { EventCard } from "@tcg/op-types";
import { st07PowerMochi016I18n } from "./st07-016-power-mochi.i18n.ts";
export const st07PowerMochi016: EventCard = {
  id: "ST07-016",
  canonicalId: "ST07-016",
  slug: "power-mochi/st07-016",
  name: "Power Mochi",
  printings: [
    {
      id: "ST07-016",
      artId: "ST07-016",
      setCode: "ST07",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST07-016.png",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "ST07",
  cost: 1,
  traits: ["Big Mom Pirates"],
  effect:
    "[Counter] Look at up to 1 card from the top of your or your opponent's Life cards, and place it at the top or bottom of the Life cards. Then, up to 1 of your Leader or Character cards gains +2000 power during this battle.",
  trigger:
    "[Trigger] Draw 1 card, look at up to 1 card from the top of your or your opponent's Life cards, and place it at the top or bottom of the Life cards.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "lookAtLife",
            player: "either",
            position: "topOrBottom",
            upTo: true,
          },
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
            action: "lookAtLife",
            player: "either",
            position: "topOrBottom",
            upTo: true,
          },
        ],
      },
    ],
  },
  i18n: st07PowerMochi016I18n,
};
