import type { CharacterCard } from "@tcg/op-types";
import { eb01TBone049I18n } from "./049-t-bone.i18n.ts";

export const eb01TBone049: CharacterCard = {
  id: "EB01-049",
  canonicalId: "EB01-049",
  slug: "t-bone",
  name: "T-Bone",
  printings: [
    {
      id: "EB01-049",
      artId: "EB01-049",
      setCode: "EB01",
      collectorNumber: "049",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-049.jpg",
    },
    {
      id: "EB01-049_p1",
      artId: "EB01-049_p1",
      setCode: "EB01",
      collectorNumber: "049",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-049_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "EB01",
  cost: 5,
  power: 5000,
  counter: 2000,
  traits: ["Navy Water Seven"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-049_p1.jpg",
      imageId: "EB01-049_p1",
    },
  ],
  effect: "[On Play] K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: eb01TBone049I18n,
};
