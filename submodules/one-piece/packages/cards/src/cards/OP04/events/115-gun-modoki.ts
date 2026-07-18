import type { EventCard } from "@tcg/op-types";
import { op04GunModoki115I18n } from "./115-gun-modoki.i18n.ts";

export const op04GunModoki115: EventCard = {
  id: "OP04-115",
  canonicalId: "OP04-115",
  slug: "gun-modoki",
  name: "Gun Modoki",
  printings: [
    {
      id: "OP04-115",
      artId: "OP04-115",
      setCode: "OP04",
      collectorNumber: "115",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-115.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "OP04",
  cost: 1,
  traits: ["Land of Wano Kouzuki Clan"],
  effect:
    "[Main] You may add 1 card from the top or bottom of your Life cards to your hand: Up to 1 of your [Land of Wano] type Characters gains [Double Attack] during this turn. (This card deals 2 damage.) [Trigger] Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "choice",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Land of Wano",
                  match: "includes",
                },
              ],
            },
            keyword: "doubleAttack",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
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
        ],
      },
    ],
  },
  i18n: op04GunModoki115I18n,
};
