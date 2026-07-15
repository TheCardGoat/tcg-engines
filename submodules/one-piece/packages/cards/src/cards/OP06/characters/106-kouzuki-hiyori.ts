import type { CharacterCard } from "@tcg/op-types";
import { op06KouzukiHiyori106I18n } from "./106-kouzuki-hiyori.i18n.ts";

export const op06KouzukiHiyori106: CharacterCard = {
  id: "OP06-106",
  canonicalId: "OP06-106",
  slug: "kouzuki-hiyori/op06-106",
  name: "Kouzuki Hiyori",
  printings: [
    {
      id: "OP06-106",
      artId: "OP06-106",
      setCode: "OP06",
      collectorNumber: "106",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-106.jpg",
    },
    {
      id: "OP06-106_p1",
      artId: "OP06-106_p1",
      setCode: "OP06",
      collectorNumber: "106",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-106_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP06",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-106_p1.jpg",
      imageId: "OP06-106_p1",
    },
  ],
  effect:
    "[On Play] You may add 1 card from the top or bottom of your Life cards to your hand: Add up to 1 card from your hand to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op06KouzukiHiyori106I18n,
};
