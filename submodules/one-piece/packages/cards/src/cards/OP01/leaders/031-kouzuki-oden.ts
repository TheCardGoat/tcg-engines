import type { LeaderCard } from "@tcg/op-types";
import { op01KouzukiOden031I18n } from "./031-kouzuki-oden.i18n.ts";

export const op01KouzukiOden031: LeaderCard = {
  id: "OP01-031",
  canonicalId: "OP01-031",
  slug: "kouzuki-oden/op01-031",
  name: "Kouzuki Oden",
  printings: [
    {
      id: "OP01-031",
      artId: "OP01-031",
      setCode: "OP01",
      collectorNumber: "031",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-031.jpg",
    },
    {
      id: "OP01-031_p1",
      artId: "OP01-031_p1",
      setCode: "OP01",
      collectorNumber: "031",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-031_p1.jpg",
    },
  ],
  cardType: "leader",
  color: ["green"],
  rarity: "L",
  setId: "OP01",
  power: 5000,
  life: 5,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-031_p1.jpg",
      imageId: "OP01-031_p1",
    },
  ],
  effect:
    '[Activate:Main] [Once Per Turn] You can trash 1 "Land of Wano" type card from your hand: Set up to 2 of your DON!! cards as active.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Land of Wano",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op01KouzukiOden031I18n,
};
