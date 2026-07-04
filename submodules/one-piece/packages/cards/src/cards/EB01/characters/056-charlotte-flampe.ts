import type { CharacterCard } from "@tcg/op-types";
import { eb01CharlotteFlampe056I18n } from "./056-charlotte-flampe.i18n.ts";

export const eb01CharlotteFlampe056: CharacterCard = {
  id: "EB01-056",
  canonicalId: "EB01-056",
  slug: "charlotte-flampe/eb01-056",
  name: "Charlotte Flampe",
  printings: [
    {
      id: "EB01-056",
      artId: "EB01-056",
      setCode: "EB01",
      collectorNumber: "056",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-056.jpg",
    },
    {
      id: "EB01-056_p1",
      artId: "EB01-056_p1",
      setCode: "EB01",
      collectorNumber: "056",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-056_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "EB01",
  cost: 1,
  power: 1000,
  counter: 2000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-056_p1.jpg",
      imageId: "EB01-056_p1",
    },
  ],
  effect:
    "[On Play]You may add 1 card from the top or bottom of your Life cards to your hand: Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb01CharlotteFlampe056I18n,
};
