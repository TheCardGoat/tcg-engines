import type { CharacterCard } from "@tcg/op-types";
import { prb01KuzanOp02096Reprint096I18n } from "./096-kuzan-op02-096-reprint.i18n.ts";

export const prb01KuzanOp02096Reprint096: CharacterCard = {
  id: "OP02-096",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "PRB01",
  cost: 4,
  power: 5000,
  traits: ["Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-096_p3.jpg",
      imageId: "OP02-096_p3",
    },
  ],
  effect:
    "[On Play] Draw 1 card.[When Attacking] Give up to 1 of your opponent's Characters -4 cost during this turn.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
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
  i18n: prb01KuzanOp02096Reprint096I18n,
};
