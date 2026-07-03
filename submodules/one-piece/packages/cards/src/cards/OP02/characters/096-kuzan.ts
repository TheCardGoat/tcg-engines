import type { CharacterCard } from "@tcg/op-types";
import { op02Kuzan096I18n } from "./096-kuzan.i18n.ts";

export const op02Kuzan096: CharacterCard = {
  id: "OP02-096",
  canonicalId: "OP02-096",
  slug: "kuzan/op02-096",
  name: "Kuzan",
  printings: [
    {
      id: "OP02-096",
      artId: "OP02-096",
      setCode: "OP02",
      collectorNumber: "096",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-096.jpg",
    },
    {
      id: "OP02-096_p1",
      artId: "OP02-096_p1",
      setCode: "OP02",
      collectorNumber: "096",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-096_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP02",
  cost: 4,
  power: 5000,
  traits: ["Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-096_p1.jpg",
      imageId: "OP02-096_p1",
    },
  ],
  effect:
    "[On Play] Draw 1 card. [When Attacking] Give up to 1 of your opponent's Characters -4 cost during this turn.",
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
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -4,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op02Kuzan096I18n,
};
