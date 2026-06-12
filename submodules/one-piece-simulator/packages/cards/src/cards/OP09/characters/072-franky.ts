import type { CharacterCard } from "@tcg/op-types";
import { op09Franky072I18n } from "./072-franky.i18n.ts";

export const op09Franky072: CharacterCard = {
  id: "OP09-072",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP09",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-072_p1.jpg",
      imageId: "OP09-072_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] DON!! 2, You may trash 1 card from your hand: Draw 2 cards.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09Franky072I18n,
};
