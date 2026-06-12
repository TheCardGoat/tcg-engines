import type { CharacterCard } from "@tcg/op-types";
import { prb02BasilHawkinsOp10109Reprint109I18n } from "./109-basil-hawkins-op10-109-reprint.i18n.ts";

export const prb02BasilHawkinsOp10109Reprint109: CharacterCard = {
  id: "OP10-109",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Hawkins Pirates Supernovas"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-109_p1.jpg",
      imageId: "OP10-109_p1",
    },
  ],
  effect:
    '[On K.O.] Trash up to 1 card from the top of your opponent\'s Life cards.[Trigger] Draw 2 cards and trash 1 card from your hand.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "trash",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: prb02BasilHawkinsOp10109Reprint109I18n,
};
