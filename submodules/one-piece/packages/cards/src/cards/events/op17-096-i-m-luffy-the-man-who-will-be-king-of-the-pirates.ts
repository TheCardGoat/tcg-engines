import type { EventCard } from "@tcg/op-types";
import { op17IMLuffyTheManWhoWillBeKingOfThePirates096I18n } from "./op17-096-i-m-luffy-the-man-who-will-be-king-of-the-pirates.i18n.ts";

export const op17IMLuffyTheManWhoWillBeKingOfThePirates096: EventCard = {
  id: "OP17-096",
  canonicalId: "OP17-096",
  slug: "i-m-luffy-the-man-who-will-be-king-of-the-pirates/op17-096",
  name: "I'm Luffy!! The Man Who Will Be King of the Pirates!!",
  printings: [
    {
      id: "OP17-096",
      artId: "OP17-096",
      setCode: "OP17",
      collectorNumber: "096",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-096_Mukh9zl.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "OP17",
  cost: 1,
  trigger: "Add up to 1 {Elbaph} type card from your trash to your hand.",
  traits: ["Elbaph The Four Emperors Straw Hat Crew"],
  effect:
    "[Counter] If there is a Character with a cost of 12 or more, up to 1 of your Leader or Characters gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "existsOnField",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 12,
              },
            ],
          },
        ],
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
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Elbaph",
                  match: "includes",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op17IMLuffyTheManWhoWillBeKingOfThePirates096I18n,
};
