import type { CharacterCard } from "@tcg/op-types";
import { prb02UrougeReprint021I18n } from "./021-urouge-reprint.i18n.ts";

export const prb02UrougeReprint021: CharacterCard = {
  id: "OP07-021",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Fallen Monk Pirates Supernovas"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-021_p8.jpg",
      imageId: "OP07-021_p8",
    },
  ],
  effect:
    '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[End of Your Turn] Set up to 1 of your DON!! cards as active.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: prb02UrougeReprint021I18n,
};
