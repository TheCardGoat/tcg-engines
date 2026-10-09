import type { EventCard } from "@tcg/op-types";
import { st29KizaruComparedToTwoYearsAgoWeReAHundredTimesStrongerNow016I18n } from "./st29-016-kizaru-compared-to-two-years-ago-we-re-a-hundred-times-stronger-now.i18n.ts";
export const st29KizaruComparedToTwoYearsAgoWeReAHundredTimesStrongerNow016: EventCard = {
  id: "ST29-016",
  canonicalId: "ST29-016",
  slug: "kizaru-compared-to-two-years-ago-we-re-a-hundred-times-stronger-now/st29-016",
  name: "Kizaru!! Compared to Two Years Ago We're a Hundred Times Stronger Now!!",
  printings: [
    {
      id: "ST29-016",
      artId: "ST29-016",
      setCode: "ST29",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST29-016.png",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "ST29",
  cost: 1,
  traits: ["Egghead", "The Four Emperors", "Straw Hat Crew"],
  effect:
    "[Main] Your [Monkey.D.Luffy] Leader gains [Unblockable] during this turn. (This card cannot be blocked.) [Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "name",
                  value: "Monkey.D.Luffy",
                },
              ],
            },
            keyword: "unblockable",
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: st29KizaruComparedToTwoYearsAgoWeReAHundredTimesStrongerNow016I18n,
};
