import type { CharacterCard } from "@tcg/op-types";
import { eb01Shirahoshi057I18n } from "./057-shirahoshi.i18n.ts";

export const eb01Shirahoshi057: CharacterCard = {
  id: "EB01-057",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "EB01",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Merfolk"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-057_p1.jpg",
      imageId: "EB01-057_p1",
    },
  ],
  effect:
    "When this Character is K.O.'d by your opponent's effect, add up to 1 card from the top of your deck to the top of your Life cards.[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: eb01Shirahoshi057I18n,
};
