import type { EventCard } from "@tcg/op-types";
import { st13FlameDragonKing017I18n } from "./st13-017-flame-dragon-king.i18n.ts";
export const st13FlameDragonKing017: EventCard = {
  id: "ST13-017",
  canonicalId: "ST13-017",
  slug: "flame-dragon-king/st13-017",
  name: "Flame Dragon King",
  printings: [
    {
      id: "ST13-017",
      artId: "ST13-017",
      setCode: "ST13",
      collectorNumber: "017",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST13-017.png",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "ST13",
  cost: 2,
  traits: ["Dressrosa", "Revolutionary Army"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, look at all your Life cards and place them back in your Life area in any order.",
  trigger:
    "You may add 1 card from the top or bottom of your Life cards to your hand: Add up to 1 card from your hand to the top of your Life cards.",
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
            action: "rearrangeLife",
            player: "self",
          },
        ],
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "choice",
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st13FlameDragonKing017I18n,
};
