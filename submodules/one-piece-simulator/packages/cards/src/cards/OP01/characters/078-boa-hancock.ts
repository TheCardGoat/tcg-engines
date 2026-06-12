import type { CharacterCard } from "@tcg/op-types";
import { op01BoaHancock078I18n } from "./078-boa-hancock.i18n.ts";

export const op01BoaHancock078: CharacterCard = {
  id: "OP01-078",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP01",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Kuja Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-078_p1.jpg",
      imageId: "OP01-078_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [DON!! x1] [When Attacking]/[On Block] Draw 1 card if you have 5 or less cards in your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "handCount",
              player: "self",
              comparison: "lte",
              value: 5,
            },
          },
        ],
      },
      {
        trigger: "onBlock",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "handCount",
              player: "self",
              comparison: "lte",
              value: 5,
            },
          },
        ],
      },
    ],
  },
  i18n: op01BoaHancock078I18n,
};
