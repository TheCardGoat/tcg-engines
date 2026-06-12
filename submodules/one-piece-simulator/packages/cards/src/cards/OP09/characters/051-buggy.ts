import type { CharacterCard } from "@tcg/op-types";
import { op09Buggy051I18n } from "./051-buggy.i18n.ts";

export const op09Buggy051: CharacterCard = {
  id: "OP09-051",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP09",
  cost: 10,
  power: 12000,
  traits: ["The Four Emperors Cross Guild"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-051_p3.jpg",
      imageId: "OP09-051_p3",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-051_p1.jpg",
      imageId: "OP09-051_p1",
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
  i18n: op09Buggy051I18n,
};
