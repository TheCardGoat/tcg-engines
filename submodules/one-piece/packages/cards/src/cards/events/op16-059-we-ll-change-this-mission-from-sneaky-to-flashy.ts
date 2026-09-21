import type { EventCard } from "@tcg/op-types";
import { op16WeLlChangeThisMissionFromSneakyToFlashy059I18n } from "./op16-059-we-ll-change-this-mission-from-sneaky-to-flashy.i18n.ts";

export const op16WeLlChangeThisMissionFromSneakyToFlashy059: EventCard = {
  id: "OP16-059",
  canonicalId: "OP16-059",
  slug: "we-ll-change-this-mission-from-sneaky-to-flashy/op16-059",
  name: "We'll Change This Mission from Sneaky to Flashy!",
  printings: [
    {
      id: "OP16-059",
      artId: "OP16-059",
      setCode: "OP16",
      collectorNumber: "059",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-059_yoLahzo.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP16",
  cost: 1,
  traits: ["Buggy Pirates Impel Down"],
  effect:
    "[Main] You may rest 7 of your DON!! cards: Look at 5 cards from the top of your deck; play up to 2 {Impel Down} type Character cards with 6000 power or less. Then, place the rest at the bottom of your deck in any order.\n[Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restDon",
            amount: 7,
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 2,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "power",
                comparison: "lte",
                value: 6000,
              },
              {
                filter: "trait",
                value: "Impel Down",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "character",
            remainderPosition: "bottom",
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
  i18n: op16WeLlChangeThisMissionFromSneakyToFlashy059I18n,
};
