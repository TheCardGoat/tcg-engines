import type { EventCard } from "@tcg/op-types";
import { pTheWorldSContinuation059I18n } from "./p-059-the-world-s-continuation.i18n.ts";
export const pTheWorldSContinuation059: EventCard = {
  id: "P-059",
  canonicalId: "P-059",
  slug: "the-world-s-continuation/p-059",
  name: "The World's Continuation",
  printings: [
    {
      id: "P-059",
      artId: "P-059",
      setCode: "P",
      collectorNumber: "059",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-059.png",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 2,
  traits: ["Music", "FILM"],
  effect:
    "[Counter] If your Leader is [Uta], you may return any number of Characters on your field to the owner's hand. Up to 1 of your Leader or Character cards gains +2000 power during this battle for every returned Character.",
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "leaderName",
            name: "Uta",
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
                upTo: true,
              },
            },
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
            value: 0,
            valuePerPreviousActionTarget: 2000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: pTheWorldSContinuation059I18n,
};
