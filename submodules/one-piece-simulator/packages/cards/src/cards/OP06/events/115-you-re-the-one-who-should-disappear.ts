import type { EventCard } from "@tcg/op-types";
import { op06YouReTheOneWhoShouldDisappear115I18n } from "./115-you-re-the-one-who-should-disappear.i18n.ts";

export const op06YouReTheOneWhoShouldDisappear115: EventCard = {
  id: "OP06-115",
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "OP06",
  cost: 0,
  trigger:
    "If you have 0 Life cards, you may add up to 1 card from the top of your deck to the top of your Life cards. Then, trash 1 card from your hand.",
  traits: ["Sky Island"],
  effect:
    "[Counter] You may trash 1 card from your hand: Up to 1 of your Leader or Character cards gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
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
            value: 3000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op06YouReTheOneWhoShouldDisappear115I18n,
};
