import type { CharacterCard } from "@tcg/op-types";
import { prb01BoaHancockOp01078Reprint078I18n } from "./078-boa-hancock-op01-078-reprint.i18n.ts";

export const prb01BoaHancockOp01078Reprint078: CharacterCard = {
  id: "OP01-078",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "PRB01",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Kuja Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-078_p4.png",
      imageId: "OP01-078_p4",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[DON!! x1] [When Attacking]/[On Block] Draw 1 card if you have 5 or less cards in your hand.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
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
  i18n: prb01BoaHancockOp01078Reprint078I18n,
};
