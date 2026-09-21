import type { EventCard } from "@tcg/op-types";
import { op16IVeComeHereToCutThoseChains099I18n } from "./op16-099-i-ve-come-here-to-cut-those-chains.i18n.ts";

export const op16IVeComeHereToCutThoseChains099: EventCard = {
  id: "OP16-099",
  canonicalId: "OP16-099",
  slug: "i-ve-come-here-to-cut-those-chains/op16-099",
  name: "I've Come Here... To Cut Those Chains!!!",
  printings: [
    {
      id: "OP16-099",
      artId: "OP16-099",
      setCode: "OP16",
      collectorNumber: "099",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-099_ioohJH9.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP16",
  cost: 1,
  traits: ["Land of Wano"],
  effect:
    "[Main] You may rest 6 of your DON!! cards: Trash 5 cards from the top of your deck. Then, play up to 1 {Land of Wano} type Character card with a cost of 6 or less from your trash. [Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restDon",
            amount: 6,
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 5,
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 6,
              },
              {
                filter: "trait",
                value: "Land of Wano",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
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
  i18n: op16IVeComeHereToCutThoseChains099I18n,
};
