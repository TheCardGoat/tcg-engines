import type { EventCard } from "@tcg/op-types";
import { eb01SorryIMAGoner029I18n } from "./029-sorry-i-m-a-goner.i18n.ts";

export const eb01SorryIMAGoner029: EventCard = {
  id: "EB01-029",
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "EB01",
  cost: 1,
  traits: ["Straw Hat Crew East Blue"],
  effect:
    "[Counter] Reveal 1 card from the top of your deck. If the revealed card has a cost of 4 or more, return up to 1 of your Characters to the owner's hand. Then, place the revealed card at the bottom of your deck.[Trigger] Return up to 1 Character with a cost of 8 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 1,
            position: "top",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "returnToHand",
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
                  value: 8,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: eb01SorryIMAGoner029I18n,
};
