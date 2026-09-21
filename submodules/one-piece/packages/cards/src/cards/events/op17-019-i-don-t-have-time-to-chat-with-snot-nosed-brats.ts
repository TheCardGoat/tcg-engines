import type { EventCard } from "@tcg/op-types";
import { op17IDonTHaveTimeToChatWithSnotNosedBrats019I18n } from "./op17-019-i-don-t-have-time-to-chat-with-snot-nosed-brats.i18n.ts";

export const op17IDonTHaveTimeToChatWithSnotNosedBrats019: EventCard = {
  id: "OP17-019",
  canonicalId: "OP17-019",
  slug: "i-don-t-have-time-to-chat-with-snot-nosed-brats/op17-019",
  name: "I Don't Have Time to Chat with Snot-Nosed Brats",
  printings: [
    {
      id: "OP17-019",
      artId: "OP17-019",
      setCode: "OP17",
      collectorNumber: "019",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-019_dshq9s8.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP17",
  cost: 1,
  trigger: "Your Leader gains +1000 power during this turn.",
  traits: ["The Four Emperors Whitebeard Pirates"],
  effect:
    '[Main] Look at 5 cards from the top of your deck; reveal up to 1 card with a type including "Whitebeard Pirates" and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "trait",
                value: "Whitebeard Pirates",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
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
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op17IDonTHaveTimeToChatWithSnotNosedBrats019I18n,
};
