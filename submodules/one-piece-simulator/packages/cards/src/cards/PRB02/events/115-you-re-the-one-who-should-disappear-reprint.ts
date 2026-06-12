import type { EventCard } from "@tcg/op-types";
import { prb02YouReTheOneWhoShouldDisappearReprint115I18n } from "./115-you-re-the-one-who-should-disappear-reprint.i18n.ts";

export const prb02YouReTheOneWhoShouldDisappearReprint115: EventCard = {
  id: "OP06-115",
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "PRB02",
  cost: 0,
  traits: ["Sky Island"],
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-115_p1.jpg",
      imageId: "OP06-115_p1",
    },
  ],
  effect:
    '[Counter] You may trash 1 card from your hand: Up to 1 of your Leader or Character cards gains +3000 power during this battle.[Trigger] If you have 0 Life cards, you may add up to 1 card from the top of your deck to the top of your Life cards. Then, trash 1 card from your hand.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
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
      {
        trigger: "trigger",
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: prb02YouReTheOneWhoShouldDisappearReprint115I18n,
};
