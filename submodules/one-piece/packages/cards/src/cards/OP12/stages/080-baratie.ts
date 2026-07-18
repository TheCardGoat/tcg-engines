import type { StageCard } from "@tcg/op-types";
import { op12Baratie080I18n } from "./080-baratie.i18n.ts";

export const op12Baratie080: StageCard = {
  id: "OP12-080",
  canonicalId: "OP12-080",
  slug: "baratie",
  name: "Baratie",
  printings: [
    {
      id: "OP12-080",
      artId: "OP12-080",
      setCode: "OP12",
      collectorNumber: "080",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-080_gM59Y45.jpg",
    },
  ],
  cardType: "stage",
  color: ["purple"],
  rarity: "C",
  setId: "OP12",
  cost: 1,
  trigger: "Play this card.",
  traits: ["East Blue"],
  effect:
    "[Activate: Main] You may place this Stage at the bottom of the owner's deck: If your Leader is [Sanji], look at 3 cards from the top of your deck; reveal up to 1 Event and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnThisToDeck",
            position: "bottom",
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
                filter: "cardCategory",
                value: "event",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
            condition: {
              condition: "leaderName",
              name: "Sanji",
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op12Baratie080I18n,
};
