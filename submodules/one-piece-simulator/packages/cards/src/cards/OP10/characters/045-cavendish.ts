import type { CharacterCard } from "@tcg/op-types";
import { op10Cavendish045I18n } from "./045-cavendish.i18n.ts";

export const op10Cavendish045: CharacterCard = {
  id: "OP10-045",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP10",
  cost: 4,
  power: 6000,
  traits: ["Beautiful Pirates Dressrosa"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-045_p1.jpg",
      imageId: "OP10-045_p1",
    },
  ],
  effect: "[When Attacking] [Once Per Turn] Draw 2 cards and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
        oncePerTurn: true,
      },
    ],
  },
  i18n: op10Cavendish045I18n,
};
