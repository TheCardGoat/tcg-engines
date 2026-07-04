import type { EventCard } from "@tcg/op-types";
import { op10LetSMeetAgainInTheNewWorld115I18n } from "./115-let-s-meet-again-in-the-new-world.i18n.ts";

export const op10LetSMeetAgainInTheNewWorld115: EventCard = {
  id: "OP10-115",
  canonicalId: "OP10-115",
  slug: "let-s-meet-again-in-the-new-world",
  name: "Let's Meet Again in the New World",
  printings: [
    {
      id: "OP10-115",
      artId: "OP10-115",
      setCode: "OP10",
      collectorNumber: "115",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-115.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "OP10",
  cost: 2,
  trigger:
    "K.O. up to 1 of your opponent's Characters with a cost equal to or less than the number of your opponent's Life cards.",
  traits: ["Kid Pirates Supernovas"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, if you have 0 Life cards, draw 1 card.",
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
            value: 4000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op10LetSMeetAgainInTheNewWorld115I18n,
};
