import type { EventCard } from "@tcg/op-types";
import { st09ThunderBagua015I18n } from "./st09-015-thunder-bagua.i18n.ts";
export const st09ThunderBagua015: EventCard = {
  id: "ST09-015",
  canonicalId: "ST09-015",
  slug: "thunder-bagua/st09-015",
  name: "Thunder Bagua",
  printings: [
    {
      id: "ST09-015",
      artId: "ST09-015",
      setCode: "ST09",
      collectorNumber: "015",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST09-015.png",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "ST09",
  cost: 2,
  traits: ["Land of Wano"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, if you have 2 or less Life cards, add up to 1 of your opponent's Characters with a cost of 3 or less to the top or bottom of the owner's Life cards face-up.",
  trigger: "[Trigger] Draw 1 card.",
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
            action: "addToLife",
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
                  value: 3,
                },
              ],
            },
            position: "choice",
            faceUp: true,
            condition: {
              condition: "lifeCount",
              player: "self",
              comparison: "lte",
              value: 2,
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
  i18n: st09ThunderBagua015I18n,
};
