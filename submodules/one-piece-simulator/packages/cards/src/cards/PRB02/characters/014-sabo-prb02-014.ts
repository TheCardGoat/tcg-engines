import type { CharacterCard } from "@tcg/op-types";
import { prb02SaboPrb02014014I18n } from "./014-sabo-prb02-014.i18n.ts";

export const prb02SaboPrb02014014: CharacterCard = {
  id: "PRB02-014",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "PRB02",
  cost: 6,
  power: 6000,
  counter: 2000,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-014_p1.jpg",
      imageId: "PRB02-014_p1",
    },
  ],
  effect:
    "If you have 15 or more cards in your trash, give this card in your hand -3 cost.[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: prb02SaboPrb02014014I18n,
};
