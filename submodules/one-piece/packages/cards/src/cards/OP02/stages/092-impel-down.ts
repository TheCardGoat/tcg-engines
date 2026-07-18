import type { StageCard } from "@tcg/op-types";
import { op02ImpelDown092I18n } from "./092-impel-down.i18n.ts";

export const op02ImpelDown092: StageCard = {
  id: "OP02-092",
  canonicalId: "OP02-092",
  slug: "impel-down",
  name: "Impel Down",
  printings: [
    {
      id: "OP02-092",
      artId: "OP02-092",
      setCode: "OP02",
      collectorNumber: "092",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-092.jpg",
    },
  ],
  cardType: "stage",
  color: ["purple"],
  rarity: "C",
  setId: "OP02",
  cost: 1,
  traits: ["Impel Down"],
  effect:
    "[Activate:Main] You may trash 1 card from your hand and rest this Stage: Look at 3 cards from the top of your deck; reveal up to 1 [Impel Down] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
          {
            cost: "restThisCard",
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
                filter: "trait",
                value: "Impel Down",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op02ImpelDown092I18n,
};
