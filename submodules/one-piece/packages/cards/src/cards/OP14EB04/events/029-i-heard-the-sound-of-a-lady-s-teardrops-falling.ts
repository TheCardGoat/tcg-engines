import type { EventCard } from "@tcg/op-types";
import { op14eb04IHeardTheSoundOfALadySTeardropsFalling029I18n } from "./029-i-heard-the-sound-of-a-lady-s-teardrops-falling.i18n.ts";

export const op14eb04IHeardTheSoundOfALadySTeardropsFalling029: EventCard = {
  id: "EB04-029",
  canonicalId: "EB04-029",
  slug: "i-heard-the-sound-of-a-lady-s-teardrops-falling",
  name: "I Heard the Sound...of a Lady's Teardrops Falling",
  printings: [
    {
      id: "EB04-029",
      artId: "EB04-029",
      setCode: "OP14EB04",
      collectorNumber: "029",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-029_C9R8NQB.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 1,
  traits: ["Straw Hat Crew Punk Hazard"],
  effect:
    "[Main] If your Leader is [Sanji], look at 3 cards from the top of your deck; reveal up to 1 [Sanji] or Event card and add it to your hand. Then, trash the rest.\n[Counter] You may trash 1 card from your hand: Up to 1 of your [Sanji] cards gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderName",
            name: "Sanji",
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 3,
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
                filter: "anyOf",
                groups: [
                  [
                    {
                      filter: "name",
                      value: "Sanji",
                    },
                  ],
                  [
                    {
                      filter: "cardCategory",
                      value: "event",
                    },
                  ],
                ],
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
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
              filters: [
                {
                  filter: "name",
                  value: "Sanji",
                },
              ],
            },
            value: 4000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04IHeardTheSoundOfALadySTeardropsFalling029I18n,
};
