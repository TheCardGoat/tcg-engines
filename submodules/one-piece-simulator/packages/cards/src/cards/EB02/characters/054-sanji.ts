import type { CharacterCard } from "@tcg/op-types";
import { eb02Sanji054I18n } from "./054-sanji.i18n.ts";

export const eb02Sanji054: CharacterCard = {
  id: "EB02-054",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "EB02",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew East Blue"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-054_p1.png",
      imageId: "EB02-054_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] If you have 2 or less Life cards, draw 2 cards and trash 1 card from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
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
  i18n: eb02Sanji054I18n,
};
