import type { EventCard } from "@tcg/op-types";
import { op06NothingAtAll096I18n } from "./096-nothing-at-all.i18n.ts";

export const op06NothingAtAll096: EventCard = {
  id: "OP06-096",
  canonicalId: "OP06-096",
  slug: "nothing-at-all",
  name: "...Nothing...at All!!!",
  printings: [
    {
      id: "OP06-096",
      artId: "OP06-096",
      setCode: "OP06",
      collectorNumber: "096",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-096.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP06",
  cost: 3,
  trigger: "Activate this card's [Counter] effect.",
  traits: ["Straw Hat Crew"],
  effect:
    "[Counter] You may add 1 card from the top of your Life cards to your hand.: Your Characters with a cost of 7 or less cannot be K.O.'d in battle during this turn.",
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "top",
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 7,
                },
              ],
            },
            duration: "thisTurn",
            restriction: "inBattle",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "counter",
          },
        ],
      },
    ],
  },
  i18n: op06NothingAtAll096I18n,
};
