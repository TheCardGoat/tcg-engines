import type { EventCard } from "@tcg/op-types";
import { op17ILlFeedOnThisRageAndUseItToBringTheWorldToRuin097I18n } from "./op17-097-i-ll-feed-on-this-rage-and-use-it-to-bring-the-world-to-ruin.i18n.ts";

export const op17ILlFeedOnThisRageAndUseItToBringTheWorldToRuin097: EventCard = {
  id: "OP17-097",
  canonicalId: "OP17-097",
  slug: "i-ll-feed-on-this-rage-and-use-it-to-bring-the-world-to-ruin/op17-097",
  name: "I'll Feed on This Rage and Use It to Bring the World to Ruin!!!",
  printings: [
    {
      id: "OP17-097",
      artId: "OP17-097",
      setCode: "OP17",
      collectorNumber: "097",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-097_8Ev7B5Q.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP17",
  cost: 1,
  traits: ["Giant Elbaph"],
  effect:
    "[Main] Give all of your opponent's Characters 1 cost during this turn.\n[Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: 1,
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
  i18n: op17ILlFeedOnThisRageAndUseItToBringTheWorldToRuin097I18n,
};
