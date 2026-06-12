import type { CharacterCard } from "@tcg/op-types";
import { op09DraculeMihawk048I18n } from "./048-dracule-mihawk.i18n.ts";

export const op09DraculeMihawk048: CharacterCard = {
  id: "OP09-048",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP09",
  cost: 6,
  power: 7000,
  traits: ["Cross Guild"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-048_p1.jpg",
      imageId: "OP09-048_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] Draw 2 cards and trash 1 card from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
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
  i18n: op09DraculeMihawk048I18n,
};
