import type { CharacterCard } from "@tcg/op-types";
import { op11Nami054I18n } from "./054-nami.i18n.ts";

export const op11Nami054: CharacterCard = {
  id: "OP11-054",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP11",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-054_p1.jpg",
      imageId: "OP11-054_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] If your Leader is multicolored, draw 3 cards and place 2 cards from your hand at the top or bottom of your deck in any order.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderMulticolored",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 3,
          },
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 2,
              },
            },
            position: "any",
          },
        ],
      },
    ],
  },
  i18n: op11Nami054I18n,
};
