import type { EventCard } from "@tcg/op-types";
import { eb01IWantToLive050I18n } from "./050-i-want-to-live.i18n.ts";

export const eb01IWantToLive050: EventCard = {
  id: "EB01-050",
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "EB01",
  cost: 3,
  traits: ["Straw Hat Crew"],
  effect:
    "[Counter] If you have 30 or more cards in your trash, add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 30,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: eb01IWantToLive050I18n,
};
