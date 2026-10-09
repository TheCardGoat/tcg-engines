import type { EventCard } from "@tcg/op-types";
import { st30CanYouStillFightLuffyOfCourse016I18n } from "./st30-016-can-you-still-fight-luffy-of-course.i18n.ts";
export const st30CanYouStillFightLuffyOfCourse016: EventCard = {
  id: "ST30-016",
  canonicalId: "ST30-016",
  slug: "can-you-still-fight-luffy-of-course/st30-016",
  name: "Can You Still Fight, Luffy?! Of Course!!",
  printings: [
    {
      id: "ST30-016",
      artId: "ST30-016",
      setCode: "ST30",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST30-016.png",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "ST30",
  cost: 1,
  traits: ["Whitebeard Pirates", "Straw Hat Crew"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle. Then, if you have [Portgas.D.Ace] and [Monkey.D.Luffy] Characters with 6000 base power, draw 1 card.",
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
            value: 3000,
            duration: "thisBattle",
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "compound",
              operator: "and",
              conditions: [
                {
                  condition: "hasCard",
                  player: "self",
                  zone: "character",
                  filters: [
                    {
                      filter: "name",
                      value: "Portgas.D.Ace",
                    },
                    {
                      filter: "basePower",
                      comparison: "eq",
                      value: 6000,
                    },
                  ],
                },
                {
                  condition: "hasCard",
                  player: "self",
                  zone: "character",
                  filters: [
                    {
                      filter: "name",
                      value: "Monkey.D.Luffy",
                    },
                    {
                      filter: "basePower",
                      comparison: "eq",
                      value: 6000,
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st30CanYouStillFightLuffyOfCourse016I18n,
};
