import type { CharacterCard } from "@tcg/op-types";
import { op02KouzukiOden030I18n } from "./030-kouzuki-oden.i18n.ts";

export const op02KouzukiOden030: CharacterCard = {
  id: "OP02-030",
  canonicalId: "OP02-030",
  slug: "kouzuki-oden/op02-030",
  name: "Kouzuki Oden",
  printings: [
    {
      id: "OP02-030",
      artId: "OP02-030",
      setCode: "OP02",
      collectorNumber: "030",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-030.jpg",
    },
    {
      id: "OP02-030_p1",
      artId: "OP02-030_p1",
      setCode: "OP02",
      collectorNumber: "030",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-030_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP02",
  cost: 8,
  power: 8000,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-030_p1.jpg",
      imageId: "OP02-030_p1",
    },
  ],
  effect:
    '[Activate:Main] [Once Per Turn] (3) (You may rest the specified number of DON!! cards in your cost area.): Set this Character as active. [On K.O.] Play up to 1 green "Land of Wano" type Character card with a cost of 3 from your deck. Then, shuffle your deck.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 3,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        oncePerTurn: true,
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "deck",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 3,
              },
              {
                filter: "color",
                value: "green",
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
          {
            action: "shuffleDeck",
            player: "self",
          },
        ],
      },
    ],
  },
  i18n: op02KouzukiOden030I18n,
};
