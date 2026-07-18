import type { CharacterCard } from "@tcg/op-types";
import { op12KouzukiHiyori028I18n } from "./028-kouzuki-hiyori.i18n.ts";

export const op12KouzukiHiyori028: CharacterCard = {
  id: "OP12-028",
  canonicalId: "OP12-028",
  slug: "kouzuki-hiyori/op12-028",
  name: "Kouzuki Hiyori",
  printings: [
    {
      id: "OP12-028",
      artId: "OP12-028",
      setCode: "OP12",
      collectorNumber: "028",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-028_fpg1yz4.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP12",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "wisdom",
  effect:
    "[Activate: Main] You may rest 1 of your DON!! cards and this Character: If your Leader is [Roronoa Zoro], look at 5 cards from the top of your deck; reveal up to 1 (Slash) attribute card or green Event and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
          {
            cost: "restThisCard",
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
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "attribute",
                    value: "slash",
                  },
                  {
                    filter: "allOf",
                    filters: [
                      {
                        filter: "color",
                        value: "green",
                      },
                      {
                        filter: "cardCategory",
                        value: "event",
                      },
                    ],
                  },
                ],
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
            condition: {
              condition: "leaderName",
              name: "Roronoa Zoro",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op12KouzukiHiyori028I18n,
};
