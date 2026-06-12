import type { CharacterCard } from "@tcg/op-types";
import { op14eb04BuggyOp09051SpGold051I18n } from "./051-buggy-op09-051-sp-gold.i18n.ts";

export const op14eb04BuggyOp09051SpGold051: CharacterCard = {
  id: "OP09-051",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 10,
  power: 12000,
  traits: ["The Four Emperors Cross Guild"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-051_p5.png",
      imageId: "OP09-051_p5",
    },
  ],
  effect:
    "[On Play] Place up to 1 of your opponent's Characters at the bottom of the owner's deck. Then, if you do not have 5 Characters with a cost of 5 or more, place this Character at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op14eb04BuggyOp09051SpGold051I18n,
};
