import type { CharacterCard } from "@tcg/op-types";
import { eb04Sentomaru053I18n } from "./eb04-053-sentomaru.i18n.ts";

export const eb04Sentomaru053: CharacterCard = {
  id: "EB04-053",
  canonicalId: "EB04-053",
  slug: "sentomaru/eb04-053",
  name: "Sentomaru",
  printings: [
    {
      id: "EB04-053",
      artId: "EB04-053",
      setCode: "EB04",
      collectorNumber: "053",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-053_rYiaytx.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB04",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Navy Egghead"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Block] If you have 2 or less Life cards, draw 1 card.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onBlock",
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
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: eb04Sentomaru053I18n,
};
